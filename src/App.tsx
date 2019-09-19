import * as React from 'react';
import './App.css';
import { NavView, nav, Page, Tabs, start, AppConfig } from 'tonva';
//import { startApp } from 'tonva';
import { CMiApp } from 'CMiApp';
//import ui from './ui';
//import { faceTabs } from 'facetabs';

const appConfig:AppConfig = {
  appName: 'bruce/mi',
  version: '1.01',
  tvs: undefined, //TVs;
};

class App extends React.Component {

  private onLogined = async () => {
    await start(CMiApp, appConfig);
    /*
    let page = <Page header={false}>
      <Tabs tabs={faceTabs} />
    </Page>
    nav.push(page);
    */
    //let b = new B('b');
    //await b.d();
    //nav.push(<div>ddd</div>)
  }
  public render() {
    return <NavView onLogined={this.onLogined} />
  }
}

export default App;