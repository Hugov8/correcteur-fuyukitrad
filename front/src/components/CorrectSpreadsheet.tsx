import { getIdSheets } from "../calls/spreadsheet"
import React from "react"
import CorrectRow from "./CorrectRow"
import { CorrectSpreadsheetProps } from "./types"
import SheetTabs from "./TabsSheet"
import { SpreadSheetIds } from "../calls/correctionType"
import Loader from "./Loader"

const CorrectSpreadsheet = (props: CorrectSpreadsheetProps) =>{
    const [spreadSheet, setSpreadSheet] = React.useState<SpreadSheetIds>({title: "na", sheets:["0"]})
    const [finish, setFinish] = React.useState<boolean>(false)
    const [currentSheet, setCurrentSheet] = React.useState<String>(spreadSheet.sheets[0])
    const [error, setError] = React.useState<boolean>(false)
    const [messageError, setMessageError] = React.useState<{
        data: {message: String},
        status: number
    }>({data:{message:"En cours"}, status:400})

    React.useEffect(()=>{
        setFinish(false)
        getIdSheets(props.urlSheet as String).then((value)=>{
            setSpreadSheet(value)
            setCurrentSheet(value.sheets[0])
            setFinish(true)
            setError(false)
        }).catch((err)=>{
            console.log(err)
            setError(true)
            setMessageError(err.response)
            setFinish(true)
        })
    }, [props.urlSheet])

    if(!finish){
        return <Loader/>
    }
    if(error) {
        return <div>
            <h1>Erreur</h1>
            <div>Message failed with error {messageError.status}</div>
            <div>Message content : {messageError.data.message}</div>
        </div>
    }

    return(<div>
        <SheetTabs
            onClick={(sheet: String) => {
                setCurrentSheet(sheet)
                }}
            sheets={spreadSheet.sheets} />
        <CorrectRow idSheet={currentSheet} spreadSheetLink={props.urlSheet as String} />
        </div>
    )
}


export default CorrectSpreadsheet