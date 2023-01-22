import React from "react";
import FormLink from "./FormLink";
import CorrectSpreadsheet from "./CorrectSpreadsheet";
import '../styles/App.css'
import { Link } from "./types";
import scroll_top from '../assets/scroll_top.svg'

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
        <h1 className="main-title">Correcteur FuyukiTrad</h1>
        {this.state.url ?
          (<div>
            <CorrectSpreadsheet urlSheet={this.state.url} />
            <div className="boutton-container"><button className="boutton-retour" onClick={() => this.setState({ url: null })}>Revenir au choix du lien</button></div>
            <div id="scroll_to_top">
              <a href="#top"><img alt="Retourner en haut" src={scroll_top} /></a>
            </div>
          </div>)
          : <FormLink onClick={(s: Link) => this.handleClickForm(s)} />}

      </div>
    );
  }
}

export default App;
