import { StringOrNull } from "../calls/commonType"
import Correcteur from "./Correcteur"

const Accueil = ({user}: {user: StringOrNull}) => {
  if (user == null) return <div>
        <h1 className="main-title">Correcteur FuyukiTrad</h1>
        <label className="label-link">Merci de vous connecter</label>
    </div>
  return <div><Correcteur /></div>
}

export default Accueil;
