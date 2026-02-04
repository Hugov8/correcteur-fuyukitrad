import React from "react"
import '../styles/App.css'
import Loader from "./Loader"
import { authMe } from "../calls/authService"
import { determineIsErrorOrNot, StringOrNull } from "../calls/commonType"
import { AuthInfos } from "../calls/authType"
import { LoginView } from "./LoginView"
import Accueil from "./Accueil"

const App = () => {
    const [user, setUser] = React.useState<StringOrNull>(null)
    const [expires, setExpires] = React.useState<StringOrNull>(null)
    const [erreur, setErreur] = React.useState<boolean>(false)

    const isLoggedIn = () => {
      authMe().then((res) => {
        if(determineIsErrorOrNot<AuthInfos>(res)) {
          setErreur(true)
        } else {
          setErreur(false)
          setUser(res.user)
          setExpires(res.expires)
        }
      }).catch((e) => {
        console.error(e)
        setErreur(true)
        setUser(null)
        setExpires(null)
      })
    }
    React.useEffect(isLoggedIn, [])

    if(user == null && !erreur) return <Loader />
    return <div><LoginView user={user} expires={expires}/><Accueil user={user}/></div>
}

export default App;
