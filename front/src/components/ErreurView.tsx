import { Erreur } from "../calls/commonType"

type ErreurProps = {
    messageError: Erreur
}
const ErreurView = (props: ErreurProps)=>{
    return <div>
            <h1>Erreur</h1>
            <div>Message failed with error {props.messageError.status}</div>
            <div>Message content : {props.messageError.messageErreur}</div>
        </div>
}

export default ErreurView
