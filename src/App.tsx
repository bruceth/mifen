import * as React from 'react';
import './App.css';
import { NavView, start, AppConfig } from 'tonva';
import { CMiApp } from 'CMiApp';

const appConfig:AppConfig = {
  appName: 'bruce/mifen',
  version: '1.01',
  tvs: undefined, //TVs;
  uqNameMap: {}
};

class App extends React.Component {

  private onLogined = async () => {
    let a = 0;
    await start(CMiApp, appConfig);
  }
  public render() {
    return <NavView onLogined={this.onLogined} />
  }
}

export default App;