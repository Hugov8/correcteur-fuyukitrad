import { URL_LOGIN, URL_LOGOUT } from "../calls/authService"
import { StringOrNull } from "../calls/commonType"
import { Boutton } from "./Boutton"

const formatLocalTime = (iso: StringOrNull) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};


export const LoginView = ({user, expires}: {user: StringOrNull, expires: StringOrNull}) => {
    const login = () => {
        window.location.replace(URL_LOGIN)
    }
    const logout = () => {
        window.location.replace(URL_LOGOUT)
    }

    if(user == null) return <div style={{display: "flex", gap: "1px", justifyContent: "flex-end", padding: "0 16px"}}>
            <Boutton text="Se connecter" onClick={login}/>
        </div>
    const expiresDate = formatLocalTime(expires)
    return <div style={{display: "flex", gap: "1px", justifyContent: "flex-end", padding: "0 16px"}}>
        <p>Connecté en tant que : {user} jusqu'à {expiresDate}</p>
        <Boutton text="Se déconnecter" onClick={logout} />
    </div>
}