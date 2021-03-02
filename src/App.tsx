import React from 'react';
import { NavView, start } from 'tonva-react';
//import logo from './logo.svg';
import './App.css';
import { CApp } from './UqApp';
import { appConfig } from './appConfig';
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
class App extends React.Component {
  
	private onLogined = async () => {
	  await start(CApp, appConfig);
	}
	public render() {
	  return <NavView onLogined={this.onLogined} />
	}
}

export default App;
  