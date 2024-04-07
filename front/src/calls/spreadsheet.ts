import axios from "axios"
import { CorrectionSheet, SpreadSheetIds, Erreur } from "./correctionType"

const URL_CONNECTEUR = window.location.origin+"/connecteur"//"http://localhost:3030"
const URL_SHEET = window.location.origin+"/api"

export const getIdSheets: (s: string, token: string) => Promise<SpreadSheetIds|Erreur> = async (link: string, token: string) => {
    return await axios.get<{response: String[]}>(URL_SHEET+'/sheetIds', {
        headers: {
            "lienSpreadsheet": link,
            "token": token,
        }
    }).then((v) => {
        return {sheets: v.data.response}
    }).catch((e)=>{
        console.log(e)
        return e.response.data.messageErreur ?
            {status: e.response.status, messageErreur: e.response.data.message}
        :
            {status: 502, messageErreur: e.message}
    
    })
}

export const verifyToken: (token: string) => Promise<boolean> = async (token: string) => {
    return await axios.get<{state: string}>(URL_SHEET+'/testToken', {
        headers: {
            "token": token,
        }, 
        validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
        }
    }).then(v => {
        return v.status===200
    }).catch(e=>{
        console.log(e)
        return false
    })
}

export const getCorrectedSheet = async (id: String, link: String, token: string): Promise<CorrectionSheet|Erreur> => {

    return await axios.get<CorrectionSheet|Erreur>(URL_CONNECTEUR+'/getCorrectedSheet?idSheet=' + id, {
        headers: {
            "urlSheet": link.toString(),
            "token": token,
        }
    }).then((rep) => {
        return rep.data
    }).catch((e)=>{
        console.log(e)
         return e.response.data.messageErreur ?
            {status: e.response.status, messageErreur: e.response.data.messageErreur}
        :
            {status:502, messageErreur:"Axios erreur: "+e.message}
        
    })
}

export const sendToDrive = async (value: String, line: number, idSheet: String, link: String, token: string): Promise<boolean> => {
    
    return await axios.put(URL_SHEET+'/writeCell', {
        lienSpreadsheet: link.toString(),
        nameSheet: idSheet,
        value: value,
        cell: "H"+line,
    }, {headers:{"token": token}}).then((data)=>{
        return data.status===200
    }).catch((e)=>{
        console.log(e)
        return false
    })
    
}

