import { useState } from "react"
import { Link } from "./types"
import '../styles/FormLink.css'

const FormLink = ({onClick}: {onClick: (s:Link)=>void}) => {

    const [url, changeUrl] = useState<Link>("")
    return (
        <div className="form-link">
            <label className="label-link" htmlFor="sheet_link">Veuillez entrer le lien de la sheet : </label>
            <input onKeyDown={(e)=>{
                if (e.key==="Enter"){
                    onClick(url)
                }
            }} className="url-input" type="url" id="sheet_link" placeholder="https://docs.google.com/" onChange={(e)=>{changeUrl(e.target.value)}}/>
            <button className="boutton-envoyer boutton-link" onClick={() => onClick(url)}> Envoyer </button>
        </div>
    )
}



export default FormLink