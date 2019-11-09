/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { autorun } from 'mobx';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VExplorer } from './VExplorer';
import { VExplorerCfg } from './VExplorerCfg';

class HomePageItems<T> extends PageItems<T> {
  ce: CExplorer;
  constructor(cHome: CExplorer) {
    super(true);
    this.ce = cHome;
    this.pageSize = 30;
    this.firstSize = 30;
  }
  protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
    let queryName = 'pe';
    if (this.ce.cApp.config.stockFind.sortType === 'dp') {
      queryName = 'dp';
    }
    let query = {
      name: queryName,
      pageStart: pageStart,
      pageSize: pageSize,
      user: this.ce.user.id,
      blackID:this.ce.cApp.blackListTagID,
      yearlen: 1,
    };
    let result = await this.ce.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) return [];
    return result as any[];
  }
  protected setPageStart(item: any) {
    this.pageStart = item === undefined ? 0 : item.order;
  }
  
  resetStart() {
    this.reset();
    this.pageStart = 0;
  }
}

export class CExplorer extends CUqBase {
  PageItems: HomePageItems<any> = new HomePageItems<any>(this);
  protected oldSortType: string;

  disposeAutorun = autorun(async () => {
    let newSortType = this.cApp.config.stockFind.sortType;
    if (newSortType === this.oldSortType)
      return;
    if (this.oldSortType === undefined) {
      this.oldSortType = newSortType;
      return;
    }
    this.oldSortType = newSortType;
    this.PageItems.resetStart();
    await this.load();
  });

  onPage = () => {
    this.PageItems.more();
  }

  onConfig = async () => {
    this.openVPage(VExplorerCfg);
  }

  async searchMain(key: string) {
    if (key !== undefined) {
      this.PageItems.resetStart();
      await this.PageItems.first(key);
    }
  }

  async internalStart(param: any) {
  }

  async load() {
    this.searchMain('');
  }

  renderSiteHeader = () => {
    return this.renderView(VSiteHeader);
  }

  renderHome = () => {
    return this.renderView(VExplorer);
  }


  openMetaView = () => {
  }

  tab = () => <this.renderHome />;

  openStockInfo = (item: NStockInfo) => {
    let cStockInfo = this.newC(CStockInfo);
    cStockInfo.start(item);
  }
}