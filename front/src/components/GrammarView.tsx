import { GrammarError } from "../calls/correctionType"

type GrammarViewProps = {
    error: GrammarError
}
const GrammarView = ({error}: GrammarViewProps) => {


    return (<div>
        <p>[{error.sType}] : {error.sMessage} </p>
        <p> Suggestions : {error.aSuggestions.map((v)=>v+' / ')} </p>
    </div>)
}

export default GrammarView