import React from "react";
import FormLink from "./FormLink";
import '../styles/App.css'
import '../styles/Boutton.css'
import Accueil from "./Accueil";
import { verifyToken } from "../calls/spreadsheet";
import Loader from "./Loader";

export type StringOrNull = string | null
class App extends React.Component<{}, { token: StringOrNull, loading: boolean, correctToken: boolean }> {

  state: { token: StringOrNull, loading: boolean, correctToken: boolean } = {
    token: null,
    loading: false,
    correctToken: false
  }

  handleClickForm(s: StringOrNull) {
    if (s && s.length !== 0) {
      this.setState({
        loading: true,
        token: s,
        correctToken: false
      })
      verifyToken(s).then(bool => {
        this.setState({
          token: s,
          loading: false,
          correctToken: bool
        })
      })
    } else {
      alert('Champ vide')
    }
  }

  render() {
    return (
      <div className="app">
      {
        this.state.loading ? (
          <Loader />
         ) :(this.state.correctToken && this.state.token ? (
          <Accueil token={this.state.token as string} />
          ) : (
          <div>
            <h1 className="main-title">Correcteur FuyukiTrad</h1>
            
            {this.state.token && !this.state.correctToken ? <p>Mot de passe incorrect</p> : <div></div>}
            
            <FormLink typeInput="password" placeholder="" message={"Entrez le mot de passe"} onClick={(s: StringOrNull) => {
              this.handleClickForm(s)
            }} />
          </div>)
          )
        }
      </div>
    );
  }
}

export default App;
