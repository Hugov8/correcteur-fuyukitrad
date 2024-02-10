import gspread
from datetime import datetime
import os
import sys
import time
import json
from tqdm import tqdm
import correcteur


os.makedirs("rapport", exist_ok=True)


###################################
###################################
####### Use only with CLI #########
###################################
###################################

def checkSheet(sheet):  
    flag = True
    # Récupération sur la sheet
    while(flag):
        try:
            values = sheet.col_values(8)
            flag = False
        except gspread.exceptions.APIError:
            print("Dodo")
            time.sleep(70)
            print("Reveil")
    
    return correcteur.checkSentences(values)


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


def connectionDriveAPI():
    # use creds to create a client to interact with the Google Drive API
    gc = gspread.service_account("client_secret.json")
    return gc

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
