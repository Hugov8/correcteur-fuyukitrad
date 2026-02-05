import axios from "axios"
import { AuthInfos, PickerInfos } from "./authType"
import { Erreur } from "./commonType"

const URL_AUTH_SERVICE = window.location.origin + "/correcteur/auth/"
export const URL_LOGIN = URL_AUTH_SERVICE +  "oauth/login/google"
export const URL_LOGOUT = URL_AUTH_SERVICE + "logout"

export const authMe: () => Promise<AuthInfos|Erreur> = async () => {
    return await axios.get(URL_AUTH_SERVICE + 'me', {withCredentials: true}).then((v) => {
        return v.data[0]
    }).catch((e)=>{
        console.log(e)
        return e.response.data.messageErreur ?
            {status: e.response.status, messageErreur: e.response.data.message}
        :
            {status: 502, messageErreur: e.message}
    
    })
}

export const getPickerInfos: () => Promise<PickerInfos> = async () => {
    return await axios.get(URL_AUTH_SERVICE + 'google/api/picker/infos', {withCredentials: true}).then((v) => {
        return v.data
    }).catch((e)=>{
        console.log(e)
        return e.response.data.messageErreur ?
            {status: e.response.status, messageErreur: e.response.data.message}
        :
            {status: 502, messageErreur: e.message}
    
    })
}
