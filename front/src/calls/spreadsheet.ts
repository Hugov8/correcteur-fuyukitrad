import axios from "axios"
import { CorrectionSheet, SpreadSheetIds } from "./correctionType"

const URL_CONNECTEUR = window.location.origin+"/connecteur"//"http://localhost:3030"

export const getIdSheets: (s: String) => Promise<SpreadSheetIds> = async (link: String) => {
    return await axios.get<SpreadSheetIds>(URL_CONNECTEUR+'/getIdSheet', {
        headers: {
            "urlSheet": link.toString(),

        }
    }).then((v) => {
        return v.data
    })
}

export const getCorrectedSheet = async (id: String, link: String): Promise<CorrectionSheet> => {

    const res = await axios.get<CorrectionSheet>(URL_CONNECTEUR+'/getCorrectedSheet?idSheet=' + id, {
        headers: {
            "urlSheet": link.toString(),
        }
    }).then((rep) => {
        return rep.data
    })
    return res
}

export const sendToDrive = async (value: String, line: number, idSheet: String, link: String): Promise<boolean> => {
    
    return await axios.post(URL_CONNECTEUR+'/modifySheet?idSheet='+idSheet, {
        value: value,
        line: line,
    }, {headers:{
        "urlSheet": link.toString(),
    }}).then((data)=>{
        return data.status===200
    }).catch((e)=>{
        console.log(e)
        return false
    })
    
}

