import { StringOrNull } from "../calls/commonType"
import { Boutton } from "./Boutton"

export const SheetTitle = ({sheetName, url}: {sheetName: StringOrNull, url: string}) => {
    return <div style={{display: "flex", gap: "1px", justifyContent: "center", padding: "0 16px"}}>
        <h1 className="main-title">{sheetName}</h1><Boutton text="Accéder"  onClick={() => window.open(url, "_blank")}/>
    </div> 
}
