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
    onClick: (sheet:String) => void,
    activeSheet : String,
}

const SheetTabs = ({ sheets, onClick, activeSheet}: SheetTabsProps) => {
    return (<div className="sheet-tabs">
        {sheets.map((sheet) => {
                return <div key={sheet.toString()}><Tab onClick={()=>{
                    onClick(sheet)
                }}
                title={sheet}
                isActive={sheet===activeSheet} /></div>
            })}
    </div>)

}

export default SheetTabs