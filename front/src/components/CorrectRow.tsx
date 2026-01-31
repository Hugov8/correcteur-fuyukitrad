import React from "react"
import CorrectionView from './CorrectionView'
import { CorrectionSheet } from "../calls/correctionType";
import { Erreur, determineIsErrorOrNot } from "../calls/commonType"
import { getCorrectedSheet } from "../calls/spreadsheet"
import { sendToDrive } from "../calls/spreadsheet"
import Loader from "./Loader"
import "../styles/CorrectRow.css"
import '../styles/Boutton.css'
import ErreurView from "./ErreurView"

type CorrectRowProps = {
    idSheet: String,
    spreadSheetLink: String,
    token: string
}

const CorrectRow = ({ idSheet, spreadSheetLink, token }: CorrectRowProps) => {
    const [correctedSheet, changeCorrectedSheet] = React.useState<CorrectionSheet>({ id: "0000", recordsLine: [] })
    const [finish, setFinish] = React.useState<boolean>(false)
    const [error, setError] = React.useState<boolean>(false)
    const [messageError, setMessageError] = React.useState<Erreur>({ status: 400, messageErreur: "En cours" })

    const loadCorrection = () => {
        setFinish(false)
        getCorrectedSheet(idSheet, spreadSheetLink, token).then((res) => {
            if (determineIsErrorOrNot<CorrectionSheet>(res)) {
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
            setMessageError({ status: err.response.status, messageErreur: err.data.messageErreur })
            setFinish(true)
        })
    }

    React.useEffect(loadCorrection, [idSheet, spreadSheetLink, token])

    if (!finish) {
        return <Loader />
    }

    if (error) {
        return <ErreurView messageError={messageError} />
    }



    return (
        <div>
            <div className="scroll-content">
                <div className="boutton-container">
                    <button className="boutton-re" onClick={() => loadCorrection()}>Recharger la sheet</button>
                </div>
                {
                    correctedSheet.recordsLine.length === 0 ?
                        <div className="ras-container">
                            <h1 className="ras-text">RAS</h1>
                            <img id="saber" src={require('../assets/saber-fatestaynight.gif')} alt="RAS"/>
                        </div>
                        :
                        <ul className="correct-row-all-lines">
                            {correctedSheet.recordsLine.map((corr, index) => {
                                return <li key={index}> <CorrectionView handleClick={(value: String, line: number) => sendToDrive(value, line, idSheet, spreadSheetLink, token)} correction={corr} /> </li>
                            })}
                        </ul>
                }
            </div>
        </div>

    )
}

export default CorrectRow