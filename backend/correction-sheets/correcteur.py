import requests
import gspread
from datetime import datetime
import os
import sys
import time
import json
from tqdm import tqdm

URL_CORRECTEUR = "http://correcteur:8080/"

with open("options.json", "r") as f:
    option_correcteur = f.read()
with open("mot_accepte.txt", "r") as f:
    acceptedWord = list(map(lambda x: x.strip("\n"), f.readlines()))

os.makedirs("rapport", exist_ok=True)

def connectionDriveAPI():
    # use creds to create a client to interact with the Google Drive API
    gc = gspread.service_account("client_secret.json")
    return gc

def checkOrthographePhrase(texte):
    data = {'text': texte, 'tf': True, "options":option_correcteur}
    rep = requests.post(URL_CORRECTEUR+"gc_text/fr", data=data)
    correction = rep.json()
    if(len(correction["error"])!=0):
        print(correction["error"])
    return correction["data"]


ERREUR_MANQUE_BALISE = "Erreur parsing [], manque le ] ! Revérifier la correction après avoir résolu le problème"
ERREUR_MANQUE_2PARTIE = "Attention [] : deuxième partie manquante"
ERREUR_BALISE_MASTER = "Attention erreur dans la balise [%1]"
def preprocessPhraseAndErrorBalise(p):
    res = p.replace("[%1]", "Fujimaru")
    #res = res.replace('[r]', "\n")
    correctionBalise = []
    i = res.find("[")
    start = 0
    while(i!=-1):
        debutBalise = i
        if res[i+1]=='%': 
            if res[i+2]!='1' or res[i+3]!=']':
                correctionBalise.append(ERREUR_BALISE_MASTER)
            start = i + 1

        elif res[i+1]=="#" or res[i+1]=='&':
            i+=1
            # On parcourt la première partie de la balise
            while(res[i]!=":"): 
                i+=1
                # Si on arrive à la fin du texte, à la fin de la balise ou au début de la balise
                if i>=len(res) or res[i]==']' or res[i]=='[': 
                    correctionBalise.append(ERREUR_MANQUE_2PARTIE)
                    break
            
            # On recherche la fin de balise
            j = debutBalise
            while res[j] != ']':
                j+=1
                # Si on a pas la fin de balise ou qu'on a un nouveau début de balise
                if j>=len(res) or res[j]=='[':
                    correctionBalise.append(ERREUR_MANQUE_BALISE)
                    break
            
            # On récrit la phrase en prenant la première partie de la balise
            res = res[:debutBalise] + res[debutBalise+2:i] + res[j+1:]
            # On recherche une nouvelle balise
            if j>=len(res): start = debutBalise + 1
            else : start = j

        else:
            j = i+1
            
            while(j<len(res) and res[j]!=']' and res[j]!='['):
                j+=1

            # Si on a trouvé une balise fermante
            if(j<len(res) and res[j]==']'):
                # Si on est à la fin du texte et qu'on finit par un [line x], on ajoute un . pour éviter de lever
                # l'alerte dur le point final. (le plus rapide à faire, à voir si on garde comme)
                if(res[i+1:i+5]=="line" and j==len(res)-1): res+='.'
                # On enlève la balise du texte
                res = res[:i]+res[j+1:]
                i = j
            else:
                correctionBalise.append(ERREUR_MANQUE_BALISE)
                start = i + 1
            
        i = res.find("[", start)
    return res, correctionBalise

def writeLog(dataCorrection):
    logFile = "rapport/log_"+dataCorrection["title"]+str(datetime.timestamp(datetime.now()))+".txt"
    with open(logFile, 'w') as f:
        f.write(dataCorrection["title"]+"\n")
        for dataSheet in dataCorrection["sheets"]:
            f.write(dataSheet["id"]+":\n")
            for dataLine in dataSheet["recordsLine"]:
                line = dataLine['line']
                value = dataLine['initialSentence'].replace("\n", " ")
                grammarList = dataLine["grammar"]
                spellingList = dataLine["spelling"]
                f.write(f"\tLigne {line} :\n")
                f.write(f"\t\t{value}\n")

                if len(grammarList)!=0:
                    f.write("\t\tGrammaire :\n")
                    for error in grammarList:
                        bilan = "["+ error["sType"] + "] "+"[de "+str(error["nStart"])+" à "+str(error["nEnd"])+"] "+error["sMessage"] +"\n\t\t\tSuggestions : "+ str(error["aSuggestions"])
                        f.write(f"\t\t\t{bilan}\n")
                if len(spellingList) !=0:
                    f.write("\t\tSpelling :\n")
                    for error in spellingList:
                        bilan = "["+error["sType"] + "] "+error["sValue"]
                        f.write(f"\t\t\t{bilan}\n")


def checkSheet(sheet):
    data = {"id": sheet.title, "recordsLine": []}    
    flag = True
    # Récupération sur la sheet
    while(flag):
        try:
            values = sheet.col_values(8)[2:]
            flag = False
        except gspread.exceptions.APIError:
            print("Dodo")
            time.sleep(70)
            print("Reveil")
    
    line = 2
    for value in values:
        line +=1
        recordLine = {"line": line, "initialSentence": value}
        prep, correctionBalise = preprocessPhraseAndErrorBalise(value)
        correction = checkOrthographePhrase(prep)

        spellingList = []
        grammarList = []
        
        if(len(correction)!=0):
            c = correction[0]
            spellingList = list(filter(lambda x: x["sValue"] not in acceptedWord, c["lSpellingErrors"]))
            grammarList = c["lGrammarErrors"]
        
        # Ajout des erreurs non comprise dans le correcteur
        if('"' in value): spellingList.append({"sType": "CHEVRON", "sValue":'"', "nStart": value.find('"'), "nEnd": value.find('"')})
        # Ajout des erreurs de balise
        for balise in correctionBalise:
            spellingList.append({"sType": "BALISE", "sValue": balise, "nStart": 0, "nEnd": 1})

        #Si on a au moins une erreur, on ajoute à la liste
        if(len(grammarList)!=0 or len(spellingList)!=0):
            recordLine["grammar"] = grammarList
            recordLine["spelling"] = spellingList
            data["recordsLine"].append(recordLine)

    return data

def getWorksheet(url):
    client = connectionDriveAPI()
    return client.open_by_url(url)

def checkOrthographeWorksheet(url):
    print("====Connexion et récupération des scripts====")
    wksheet = getWorksheet(url)
    
    data = {"title": wksheet.title, "sheets": []}

    print("====Success====")
    print("====Correction de la sheet====")
    rows = wksheet.worksheets()[1:]
    for row in tqdm(filter(lambda r: r.title!="Template" and r.title!="Names", rows), total=len(rows)-1):
        data["sheets"].append(checkSheet(row))
    print(f"====Terminé !====")
    return data


if __name__=="__main__":
    URL_CORRECTEUR = "http://localhost:8080/"
    if(len(sys.argv) != 2):
        print("Please provide the link of the google sheet.")
    elif(sys.argv[1]=="--all"):
        with open("lien.txt") as f:
            links = f.readlines()
            for url in links: checkOrthographeWorksheet(url)
    else:
        data = checkOrthographeWorksheet(sys.argv[1])
        writeLog(data)
        with open("rapport/test.json", 'w') as f:
            json.dump(data, f)