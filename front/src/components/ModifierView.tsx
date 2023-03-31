import {useState} from "react"
import "../styles/ModifierView.css"
import '../styles/Boutton.css'
import Loader from "./Loader"
import EnvoyeNotif from "./EnvoyeNotif"

type ModifierViewProps = {
    line: number,
    defaultText: String,
    onClick: (value: String, line: number) => Promise<boolean>,
}

const ModifierView = ({line, defaultText, onClick} : ModifierViewProps) => {
    const idTextArea : string = "l"+line.toString()
    const [corrige, changeCorrection] = useState<String>(defaultText)
    const [send, changeSend] = useState<boolean>(false)
    const [finished, setFinish] = useState<boolean>(true)

    const handleClick = () => {
        setFinish(false)
        onClick(corrige, line).then((bool)=>{
            changeSend(bool)
            setFinish(true)
        }).catch((err)=>{
            console.log(err)
            alert("Erreur, réessayer")
            setFinish(true)
        })
    }
    
    return (
        <div className="zone-correction">
            <textarea 
            className="correction-modif-zone"
            id={idTextArea} 
            name={idTextArea} 
            rows={1}
            cols={100}
            defaultValue={corrige.toString()}
            onChange={(event) => {
                changeCorrection(event.target.value.trim())
            }}></textarea>
            <input id="send-correction" className="boutton-envoyer"
            onClick={() => {
                handleClick()
            }}
                 type="submit" name="submitCorrection" value="Modifier sur la sheet" />

            {
                finished ? <EnvoyeNotif send={send} />: <Loader />
            }

        </div>
    )
}

export default ModifierView