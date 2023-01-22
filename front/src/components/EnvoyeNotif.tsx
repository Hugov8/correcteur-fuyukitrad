import '../styles/EnvoyeNotif.css'

type EnvoyeNotifProps = {
    send: boolean
}
const EnvoyeNotif = ({send}: EnvoyeNotifProps)=>{
    return (<div className="envoie-notif">
        {
            send ? <span style={{color: "green"}}>&#10003;</span> : <span style={{color: "red"}}>&#9747;</span>
        }

    </div>)
    
}

export default EnvoyeNotif