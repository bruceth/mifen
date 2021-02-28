import React from 'react';
import { AppConfig, NavView, start } from 'tonva';
//import logo from './logo.svg';
import './App.css';
import { CMiApp } from './UqApp';
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
const appConfig:AppConfig = {
	appName: 'bruce/mifen',
	version: '1.01',
	tvs: undefined, //TVs;
	uqNameMap: {}
  };
  
  class App extends React.Component {
  
	private onLogined = async () => {
	  await start(CMiApp, appConfig);
	}
	public render() {
	  return <NavView onLogined={this.onLogined} />
	}
  }
  
  export default App;
  