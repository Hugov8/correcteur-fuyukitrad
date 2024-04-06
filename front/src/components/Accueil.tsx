import React from "react";
import FormLink from "./FormLink";
import CorrectSpreadsheet from "./CorrectSpreadsheet";
import {StringOrNull} from './App'
import '../styles/App.css'
import '../styles/Boutton.css'

class Accueil extends React.Component<{token: string}, { url: StringOrNull }> {

  state: { url: StringOrNull } = {
    url: null
  }

  handleClickForm(s: StringOrNull) {
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
            <CorrectSpreadsheet urlSheet={this.state.url} token={this.props.token} />

            <div id="retour-choix-lien-container" className="boutton-container">
              <button className="boutton-re" onClick={() => {
                this.setState({ url: null })
              }}>Revenir au choix du lien
              </button>

            </div>
          </div>)

          : <div>
            <h1 className="main-title">Correcteur FuyukiTrad</h1>
            <FormLink placeholder="https://docs.google.com/"
             message={"Veuillez entrer le lien de la sheet : "} 
             onClick={(s: StringOrNull) => {
              this.handleClickForm(s)
            }} />
          </div>}

      </div>
    );
  }
}

export default Accueil;
