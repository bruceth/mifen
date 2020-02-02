import * as React from 'react';
import { VPage, TabCaptionComponent, Page, Tabs } from 'tonva';
import { CMiApp } from '../CMiApp';
import { meTab } from '../me';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VHome extends VPage<CMiApp> {
  async open(param?: any) {
    this.openPage(this.render);
  }
  render = (param?: any): JSX.Element => {
    let { cHome, cExporer, cAccountHome, cHistoryExplorer } = this.controller;
    let faceTabs = [
      { name: 'home', label: '首页', icon: 'home', content: cHome.tab, notify: undefined, load: async () => { await cHome.load() }, onShown: async () => { await cHome.load() } },
      { name: 'explorer', label: '选股', icon: 'search', content: cExporer.tab, load: async () => { await cExporer.load() } },
      { name: 'hisexplorer', label: '历史', icon: 'history', content: cHistoryExplorer.tab, load: async () => { await cHistoryExplorer.load() } },
      { name: 'account', label: '记账', icon: 'list', content: cAccountHome.tab, load: async () => { await cAccountHome.load() } },
      { name: 'me', label: '我的', icon: 'user', content: meTab, onShown: undefined }
    ].map(v => {
      let { name, label, icon, content, notify, load, onShown } = v;
      return {
        name: name,
        caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
        content: content,
        notify: notify,
        load: load,
        onShown: onShown
      }
    });
    return <Page header={false}>
      <Tabs tabs={faceTabs} />
    </Page>;
  }
}
