import React from "react";
import CorrectionView from './CorrectionView'
import { CorrectionSheet } from "../calls/correctionType";
import { getCorrectedSheet } from "../calls/spreadsheet";
import { sendToDrive } from "../calls/spreadsheet";
import Loader from "./Loader";
import "../styles/CorrectRow.css"
import '../styles/Boutton.css'

type CorrectRowProps = {
    idSheet: String,
    spreadSheetLink: String,
}

const CorrectRow = ({ idSheet, spreadSheetLink }: CorrectRowProps) => {
    const [correctedSheet, changeCorrectedSheet] = React.useState<CorrectionSheet>({ id: "0000", recordsLine: [] })
    const [finish, setFinish] = React.useState<boolean>(false)
    const [error, setError] = React.useState<boolean>(false)

    const loadCorrection = () => {
        setFinish(false)
        getCorrectedSheet(idSheet, spreadSheetLink).then((res) => {
            changeCorrectedSheet(res)
            setError(false)
            setFinish(true)
        }).catch((err) => {
            console.log(err)
            setError(true)
            setFinish(true)
        })
    }

    React.useEffect(loadCorrection, [idSheet])

    if (!finish) {
        return <Loader />
    }

    if (error) {
        return <h1>Erreur</h1>
    }



    return (
        <div>
            <div className="id-sheet-view" onClick={()=>{window.scrollTo(0,0)}}>{correctedSheet.id}</div>
            <div className="boutton-container"><button className="boutton-re" onClick={() => loadCorrection()}>Recharger</button> </div>
            <ul className="correct-row-all-lines">
                {correctedSheet.recordsLine.map((corr, index) => {
                    return <li key={index}> <CorrectionView handleClick={(value: String, line: number) => sendToDrive(value, line, idSheet, spreadSheetLink)} correction={corr} /> </li>
                })}
            </ul>
        </div>

    )
}

export default CorrectRow