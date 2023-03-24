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

def preprocessPhrase(p):
    res = p.replace("[%1]", "Fujimaru")
    res = res.replace('[r]', "\n")
    i = res.find("[")
    start = 0
    while(i!=-1):
        if res[i+1]=='&' or res[i+1]=="#":
            i+=1
            while(res[i]!=":"): 
                i+=1
                if i>=len(res): 
                    print("Erreur parsing [] ", p)
                    break
            res = res[:i]+" "+res[i]+" "+res[i+1:]
            start = i
        else:
            j = i+1
            while(j<len(res) and res[j]!=']'):
                j+=1

            if(j<len(res)):
                res = res[:i]+res[j+1:]
                i = j
            else:
                print("Erreur parsing [], manque ] !")
                start = i +1
            #print(res)
        i = res.find("[", start)
    return res

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
        prep = preprocessPhrase(value)
        correction = checkOrthographePhrase(prep)
        if(len(correction)==0): continue

        c = correction[0]
        spellingList = list(filter(lambda x: x["sValue"] not in acceptedWord, c["lSpellingErrors"]))
        grammarList = c["lGrammarErrors"]
        if('"' in value): spellingList.append({"sType": "CHEVRON", "sValue":'"', "nStart": value.find('"'), "nEnd": value.find('"')})
        if(len(grammarList)==0 and len(spellingList)==0): continue
        
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