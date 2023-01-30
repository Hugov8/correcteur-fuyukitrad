import React from "react";
import CorrectionView from './CorrectionView'
import { CorrectionSheet, Erreur, determineIsErrorOrNot } from "../calls/correctionType";
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
    const [messageError, setMessageError] = React.useState<Erreur>({status:400, messageErreur: "En cours"})

    const loadCorrection = () => {
        setFinish(false)
        getCorrectedSheet(idSheet, spreadSheetLink).then((res) => {
            if (determineIsErrorOrNot<CorrectionSheet>(res)){
                setError(true)
                setMessageError(res)
                setFinish(true)

            } else {
                changeCorrectedSheet(res)
                setError(false)
                setFinish(true)
            }
            
        }).catch((err) => {
            console.log(err)
            setError(true)
            setMessageError({status: err.response.status, messageErreur: err.data.messageErreur})
            setFinish(true)
        })
    }

    React.useEffect(loadCorrection, [idSheet])

    if (!finish) {
        return <Loader />
    }

    if (error) {
        return <div>
        <h1>Erreur</h1>
        <div>Message failed with error {messageError.status}</div>
        <div>Message content : {messageError.messageErreur}</div>
    </div>
    }



    return (
        <div>
            <div className="boutton-container"><button className="boutton-re" onClick={() => loadCorrection()}>Recharger la sheet</button> </div>
            <div className="scroll-content">
                <ul className="correct-row-all-lines">
                    {correctedSheet.recordsLine.map((corr, index) => {
                        return <li key={index}> <CorrectionView handleClick={(value: String, line: number) => sendToDrive(value, line, idSheet, spreadSheetLink)} correction={corr} /> </li>
                    })}
                </ul>
            </div>
        </div>

    )
}

export default CorrectRow