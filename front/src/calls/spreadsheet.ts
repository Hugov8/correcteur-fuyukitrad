import axios from "axios"
import { CorrectionSheet, SpreadSheetIds, Erreur } from "./correctionType"

const URL_CONNECTEUR = window.location.origin+"/connecteur"//"http://localhost:3030"
const URL_SHEET = window.location.origin+"/api"

export const getIdSheets: (s: String) => Promise<SpreadSheetIds|Erreur> = async (link: String) => {
    return await axios.get<{response: String[]}>(URL_SHEET+'/sheetIds', {
        headers: {
            "lienSpreadsheet": link.toString(),

        }
    }).then((v) => {
        console.log(v)
        return {sheets: v.data.response}
    }).catch((e)=>{
        console.log(e)
        return e.response.data.messageErreur ?
            {status: e.response.status, messageErreur: e.response.data.message}
        :
            {status: 502, messageErreur: e.message}
    
    })
}

export const getCorrectedSheet = async (id: String, link: String): Promise<CorrectionSheet|Erreur> => {

    return await axios.get<CorrectionSheet|Erreur>(URL_CONNECTEUR+'/getCorrectedSheet?idSheet=' + id, {
        headers: {
            "urlSheet": link.toString(),
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

export const sendToDrive = async (value: String, line: number, idSheet: String, link: String): Promise<boolean> => {
    
    return await axios.put(URL_SHEET+'/writeCell', {
        lienSpreadsheet: link.toString(),
        nameSheet: idSheet,
        value: value,
        cell: "H"+line,
    }).then((data)=>{
        return data.status===200
    }).catch((e)=>{
        console.log(e)
        return false
    })
    
}

