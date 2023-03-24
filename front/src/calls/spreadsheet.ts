import axios from "axios"
import { CorrectionSheet, SpreadSheetIds, Erreur } from "./correctionType"

const URL_CONNECTEUR = window.location.origin+"/connecteur"//"http://localhost:3030"

export const getIdSheets: (s: String) => Promise<SpreadSheetIds|Erreur> = async (link: String) => {
    return await axios.get<SpreadSheetIds>(URL_CONNECTEUR+'/getIdSheet', {
        headers: {
            "urlSheet": link.toString(),

        }
    }).then((v) => {
        return v.data
    }).catch((e)=>{
        console.log(e)
        return e.response ?
            {status: e.response.status, messageErreur: e.response.data.messageErreur}
        :
            {status: 502, messageErreur: "Axios: "+e.message}
    
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
         return e.response ?
            {status: e.response.status, messageErreur: e.response.data.messageErreur}
        :
            {status:502, messageErreur:"Axios erreur: "+e.message}
        
    })
}

export const sendToDrive = async (value: String, line: number, idSheet: String, link: String): Promise<boolean> => {
    
    return await axios.post(URL_CONNECTEUR+'/modifySheet?idSheet='+idSheet, {
        value: value,
        line: line,
    }, {headers:{
        "urlSheet": link.toString(),
    }}).then((data)=>{
        return data.status===202
    }).catch((e)=>{
        console.log(e)
        return false
    })
    
}

