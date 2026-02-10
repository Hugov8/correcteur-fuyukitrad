import { getIdSheets } from "../calls/spreadsheet"
import React from "react"
import CorrectRow from "./CorrectRow"
import SheetTabs from "./TabsSheet"
import { SpreadSheetIds } from "../calls/correctionType"
import { Erreur, StringOrNull, determineIsErrorOrNot } from "../calls/commonType"
import Loader from "./Loader"
import ErreurView from "./ErreurView"

type CorrectSpreadsheetProps = { urlSheet: StringOrNull }

const CorrectSpreadsheet = ({ urlSheet }: CorrectSpreadsheetProps) => {
    const [spreadSheet, setSpreadSheet] = React.useState<SpreadSheetIds>({ sheets: ["0"] })
    const [finish, setFinish] = React.useState<boolean>(false)
    const [currentSheet, setCurrentSheet] = React.useState<String>(spreadSheet.sheets[0] as String)
    const [error, setError] = React.useState<boolean>(false)
    const [messageError, setMessageError] = React.useState<Erreur>({ messageErreur: "En cours", status: 400 })

    React.useEffect(() => {
        setFinish(false)
        getIdSheets(urlSheet as string).then((value) => {
            if (determineIsErrorOrNot<SpreadSheetIds>(value)) {
                console.log(value.status)
                setError(true)
                setMessageError(value)
                setFinish(true)
            } else {
                setSpreadSheet(value)
                setCurrentSheet(value.sheets[0] as String)
                setFinish(true)
                setError(false)
            }

        }).catch((err) => {
            console.log(err)
            setError(true)
            setMessageError({ status: err.response.status, messageErreur: err.data.messageErreur })
            setFinish(true)
        })
    }, [urlSheet])

    if (!finish) {
        return <Loader />
    }
    if (error) {
        return <ErreurView messageError={messageError} />
    }

    return (<div>
        <SheetTabs
            onClick={(sheet: String) => {
                setCurrentSheet(sheet)
            }}
            sheets={spreadSheet.sheets}
            activeSheet={currentSheet} />
        <CorrectRow idSheet={currentSheet} spreadSheetLink={urlSheet as string} />
    </div>
    )
}


export default CorrectSpreadsheet