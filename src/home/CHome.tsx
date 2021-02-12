/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { observable, IObservableArray, autorun } from 'mobx';
import { ErForEarning, SlrForEarning } from 'regression';
import { UserTag } from '../types';
import { CMiApp } from '../CMiApp';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';
import { GFunc } from 'GFunc';
import { CMarketPE } from './CMarketPE';
import { CStock } from 'stock';

export class CHome extends CUqBase {
  //PageItems: HomePageItems = new HomePageItems(this);
  items: IObservableArray<any> = observable.array<any>([], { deep: true });
  userTag: UserTag;
  protected oldSortType: string;
  @observable warnings: any[] = [];

  disposeAutorun = autorun(async () => {
    let needLoad = false;
    let oldID = this.userTag && this.userTag.tagID;
    this.userTag = { tagName: this.cApp.config.tagName, tagID: this.cApp.tagID };
    if (oldID !== this.userTag.tagID) {
      needLoad = true;
    }

    let newSortType = this.cApp.config.userStock.sortType;
    if (this.oldSortType === undefined) {
      this.oldSortType = newSortType;
    }
    else if (this.oldSortType !== newSortType) {
      this.oldSortType = newSortType;
      needLoad = true;
    }

    if (needLoad) {
      await this.load();
    }
  });

  public AddTagStockID(tagid: number, stockID: number) {
    if (this.userTag && this.userTag.tagID === tagid) {
      this.load();
    }
  }

  public RemoveTagStockID(tagid: number, stockID: number) {
    if (this.userTag && this.userTag.tagID === tagid) {
      //this.PageItems.RemoveStock(stockID);
      let i = this.items.findIndex(v=>{return v.id === stockID})
     if (i >= 0) {
       this.items.splice(i, 1);
     }
    }
  }


  onSelectTag = async () => {
    this.openVPage(VSelectTag);
  }

  onAddStock = async () => {
    let cStock = new CStock(this.cApp);
    let r = await cStock.call() as {id:number};

    if (r !== undefined) {
      let id = r.id;
      if (id > 0) {
        let tagid = this.cApp.defaultListTagID;
        await this.cApp.miApi.call('t_tagstock$add', [this.user.id, tagid, id]);
        await this.cApp.AddTagStockID(tagid, id);
        await this.load();
      }
    }
  }

  onClickTag = async (item:any) => {
    await this.cApp.selectTag(item);
    this.closePage();
  }

  onPage = () => {
    //this.PageItems.more();
  }

  onWarningConfg = () => {
    this.cApp.cWarning.onWarningConfg();
  }


  // async searchMain(key: any) {
  //   if (key !== undefined) await this.PageItems.first(key);
  // }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  async load() {
    let tagID = this.cApp.tagID;
    if (tagID > 0) {
      await this.loadItems();
    }
  }

  async loadItems() {
    let queryName = 'taguser';

    let query = {
      name: queryName,
      pageStart: 0,
      pageSize: 1000,
      user: this.user.id,
      tag: this.cApp.tagID,
      yearlen: 1,
    };
    let result = await this.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) {
      return;
    };
    let arr = result as {id:number, order:number, data?:string, v?:number, e:number, e3:number, ep:number, price:number, exprice:number, divyield:number, r2:number, lr2:number, predictpe?:number}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      let sl = new SlrForEarning(dataArray);
      item.ep = sl.predict(4);
      item.e3 = sl.predict(7);
      item.v = GFunc.calculateVN(sl.slopeR, item.ep, item.divyield * item.price, item.exprice);
      item.predictpe = item.price / item.e3;
    }
    this.cApp.sortStocks(arr);
    let o = 1;
    for (let item of arr) {
      item.order = o;
      ++o;
    }
    this.items.clear();
    this.items.push(...arr);
  }

  setSortType = (type:string) => {
    this.cApp.setUserSortType(type);
    let arr = this.items.slice();
    this.cApp.sortStocks(arr);

    this.items.replace(arr);
  }

  async loadWarning() {
    let r = await this.cApp.miApi.query('q_warnings', [this.cApp.user.id]);
    if (r !== undefined && Array.isArray(r)) {
      this.warnings = r;
    }
    else {
      if (this.warnings.length > 0) {
        this.warnings = [];
      }
    }
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

  openMarketPE = () => {
    let cm = this.newC(CMarketPE);
    cm.start();
  }
}