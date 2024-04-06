import { useState } from "react"
import { StringOrNull } from "./App"
import '../styles/FormLink.css'

const FormLink = ({onClick, message, placeholder}: {onClick: (s:StringOrNull)=>void, message: string, placeholder: string}) => {

    const [url, changeUrl] = useState<StringOrNull>("")
    return (
        <div className="form-link">
            <label className="label-link" htmlFor="sheet_link">{message}</label>
            <input onKeyDown={(e)=>{
                if (e.key==="Enter"){
                    onClick(url)
                }
            }} className="url-input" type="url" id="sheet_link" placeholder={placeholder} onChange={(e)=>{changeUrl(e.target.value)}}/>
            <button id="boutton-link" className="boutton-envoyer" onClick={() => onClick(url)}> Envoyer </button>
        </div>
    )
}



export default FormLink