import { useState } from "react"
import CorrectSpreadsheet from "./CorrectSpreadsheet"
import '../styles/App.css'
import '../styles/Boutton.css'
import { StringOrNull } from "../calls/commonType"
import { GooglePicker } from "./GooglePicker"
import { SheetTitle } from "./SheetTitle"

export const Correcteur = () => {
    const [url, setUrl] = useState<StringOrNull>(null)
    const [sheetName, setSheetName] = useState<StringOrNull>(null)

    const handleClickForm = (s: StringOrNull) => {
        if (s && s.length !== 0) {
            setUrl(s)
        } else {
        alert('Champ vide')
        }
    }

    return (
      <div className="app">
        {url ?
          (<div>
            <SheetTitle url={url} sheetName={sheetName} />
            <CorrectSpreadsheet urlSheet={url} />

            <div id="retour-choix-lien-container" className="boutton-container">
              <button className="boutton-re" onClick={() => {
                setUrl(null)
                setSheetName(null)
              }}>Revenir au choix du lien
              </button>

            </div>
          </div>)

          : <div>
            <h1 className="main-title">Correcteur FuyukiTrad</h1>
            <GooglePicker setUrl={handleClickForm} setSheetName={setSheetName}/>
          </div>}

      </div>
    );
}

export default Correcteur;
