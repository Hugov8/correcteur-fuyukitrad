import React from "react";
import FormLink from "./FormLink";
import CorrectSpreadsheet from "./CorrectSpreadsheet";
import '../styles/App.css'
import '../styles/Boutton.css'

export type Link = String | null
class App extends React.Component<{}, { url: Link }> {

  state: { url: Link } = {
    url: null
  }

  handleClickForm(s: Link) {
    if (s && s.length !== 0) {
      this.setState({
        url: s,
      })
    } else {
      alert('Champ vide')
    }

  }

  render() {
    return (
      <div className="app">

        {this.state.url ?
          (<div>
            <CorrectSpreadsheet urlSheet={this.state.url} />

            <div id="retour-choix-lien-container" className="boutton-container">
              <button className="boutton-re" onClick={() => {
                this.setState({ url: null })
              }}>Revenir au choix du lien
              </button>

            </div>
          </div>)

          : <div>
            <h1 className="main-title">Correcteur FuyukiTrad</h1>
            <FormLink onClick={(s: Link) => {
              this.handleClickForm(s)
            }} />
          </div>}

      </div>
    );
  }
}

export default App;
