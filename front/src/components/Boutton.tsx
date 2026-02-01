
import '../styles/Boutton.css'

export const Boutton = ({onClick, text}: {onClick: () => void, text: string}) => {
    return <button className="boutton-envoyer" onClick={() => onClick()}>{text}</button>
}
