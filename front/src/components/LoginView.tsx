import { StringOrNull } from "../calls/commonType"
import { Boutton } from "./Boutton"

export const LoginView = ({user}: {user: StringOrNull}) => {
    const login = () => {
        window.location.replace("http://localhost:8080/oauth/login/google")
    }
    const logout = () => {
        window.location.replace("http://localhost:8080/logout")
    }

    if(user == null) return <div style={{display: "flex", gap: "1px", justifyContent: "flex-end", padding: "0 16px"}}>
            <Boutton text="Se connecter" onClick={login}/>
        </div>

    return <div style={{display: "flex", gap: "1px", justifyContent: "flex-end", padding: "0 16px"}}>
        <p>Connecté en tant que : {user}</p>
        <Boutton text="Se déconnecter" onClick={logout} />
    </div>
}