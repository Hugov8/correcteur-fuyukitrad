import React from 'react'
import '../styles/TabSheet.css'


type TabProps = {
    title: String,
    onClick: ()=>void,
    isActive: boolean
}
const Tab = ({ title, onClick, isActive }: TabProps) => {
    return <button onClick={() => onClick()} className={"sheet-tab"+(isActive ?" active-sheet":'')}>{title}</button>
}

type SheetTabsProps = {
    sheets: String[],
    onClick: (sheet:String) => void
}

const SheetTabs = ({ sheets, onClick}: SheetTabsProps) => {
    const [activeSheet, setActiveSheet] = React.useState<String>(sheets[0])
    return (<div className="sheet-tabs">
        {sheets.map((sheet) => {
                return <div key={sheet.toString()}><Tab onClick={()=>{
                    setActiveSheet(sheet)
                    onClick(sheet)
                }}
                title={sheet}
                isActive={sheet===activeSheet} /></div>
            })}
    </div>)

}

export default SheetTabs