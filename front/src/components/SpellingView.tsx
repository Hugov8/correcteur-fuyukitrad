
import { SpellingError } from "../calls/correctionType"

type SpellingViewProps = {
    error: SpellingError
}

const SpellingView = ({ error }: SpellingViewProps) => {
    return (
        <div>
            <p>[{error.sType}] : {error.sValue} </p>
        </div>
    )
}

export default SpellingView