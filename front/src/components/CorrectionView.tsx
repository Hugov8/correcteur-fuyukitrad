import { Correction } from "../calls/correctionType"
import GrammarView from "./GrammarView"
import ModifierView from "./ModifierView"
import SpellingView from "./SpellingView"
import "../styles/CorrectionView.css"

type CorrectionViewProps = {
    correction: Correction,
    handleClick: (corrige: String, line: number) => Promise<boolean>,
}

const CorrectionView = ({ correction, handleClick }: CorrectionViewProps) => {
    return <div>
        <div className="fautes-vue">
            <div>
                <h3 className="titre-faute">Fautes de grammaire : </h3>
                <ul>
                    {correction.grammar.map((grammar, index) => {
                        return (<li className="erreur" key={index}> <GrammarView error={grammar} /> </li>)
                    })}
                </ul>
            </div>
            <div>
                <h3>Fautes d'orthographe : </h3>
                <ul>
                    {correction.spelling.map((elem, index) => {
                        return <li className="erreur" key={index}> <SpellingView error={elem} /> </li>
                    })}
                </ul>
            </div>
        </div>

        <ModifierView onClick={handleClick} line={correction.line} defaultText={correction.initialSentence} />
    </div>
}

export default CorrectionView