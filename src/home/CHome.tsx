/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { nav } from 'tonva';
import { PageItems, Controller } from 'tonva';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { CMiApp } from 'CMiApp';

class HomePageItems<T> extends PageItems<T> {
  cHome: CHome;
  constructor(cHome: CHome) {
    super(true);
    this.cHome = cHome;
    this.pageSize = 30;
    this.firstSize = 30;
  }

  protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
    let query = {
      name: 'tagpe',
      pageStart: pageStart,
      pageSize: pageSize,
      user: this.cHome.user.id,
      tag: param.tag,
      yearlen: 1,
    };
    let result = await this.cHome.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) return [];
    return result as any[];
  }
  
  protected setPageStart(item: any) {
    this.pageStart = item === undefined ? 0 : item.order;
  }
}

export class CHome extends CUqBase {
  PageItems: PageItems<any> = new HomePageItems<any>(this);

  onPage = () => {
    this.PageItems.more();
  }

  async searchMain(key: any) {
    if (key !== undefined) await this.PageItems.first(key);
  }

  async internalStart(param: any) {

  }

  async load() {
    this.searchMain({ tag: 1 });
  }

  renderSiteHeader = () => {
    return this.renderView(VSiteHeader);
  }

  renderSearchHeader = (size?: string) => {
    return this.renderView(VSearchHeader, size);
  }


  renderHome = () => {
    return this.renderView(VHome);
  }

  openMetaView = () => {
  }

  tab = () => <this.renderHome />;

  openStockInfo = (item: NStockInfo) => {
    let cStockInfo = this.newC(CStockInfo);
    cStockInfo.start(item);
  }
}