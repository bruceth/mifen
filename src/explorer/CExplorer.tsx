/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed } from 'mobx';
import * as React from 'react';
import { autorun } from 'mobx';
import { ErForEarning, SlrForEarning } from 'regression';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VExplorer } from './VExplorer';
import { VExplorerCfg } from './VExplorerCfg';
import { GFunc } from 'GFunc';

export class CExplorer extends CUqBase {
  items: IObservableArray<any> = observable.array<any>([], { deep: true });
  @observable avgs : {avg20?:number, avg50?:number, avg100?:number, avg?:number} = {};
  lastTradeDay: number;
  protected oldSelectType: string;
  selectedItems: any[] = [];

  disposeAutorun = autorun(async () => {
    let newSelectType = this.cApp.config.stockFind.selectType;
    if (newSelectType === this.oldSelectType)
      return;
    if (this.oldSelectType === undefined) {
      this.oldSelectType = newSelectType;
      return;
    }
    this.oldSelectType = newSelectType;
    await this.load();
  });

  onPage = () => {
    //this.PageItems.more();
  }

  onConfig = async () => {
    this.openVPage(VExplorerCfg);
  }

  async internalStart(param: any) {
  }

  reload = async () => {
    await this.load();
  }

  async load() {
    this.selectedItems = [];
    await this.loadItems();
  }

  async loadItems() {
    let queryName = 'all';
    //let sName = this.cApp.config.stockFind.selectType;
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, irate} = this.cApp.config.regression;
    //if (sName !== undefined)
    //  queryName = sName;
    let query = {
      name: queryName,
      pageStart: 0,
      pageSize: 3000,
      user: this.user.id,
      blackID:this.cApp.blackListTagID,
      bMin: bmin,
      bMax: bmax,
      r2: r2,
      lMin: lmin,
      lMax: lmax,
      lr2: lr2,
      mcount: mcount,
      lr4: lr4,
      r210: r210,
    };
    let rets = await Promise.all([this.cApp.miApi.process(query, []),
                                  this.cApp.miApi.call('q_getlasttradeday', [])
      ]);
    let lastDayRet = rets[1] as {day:number}[];
    if (Array.isArray(lastDayRet) && lastDayRet.length > 0) {
      this.lastTradeDay = lastDayRet[0].day;
    }
    else {
      this.lastTradeDay = undefined;
    }
    let result = rets[0];
    if (Array.isArray(result) === false) {
      return;
    };
    let arr = result as {id:number, data?:string, v:number, pe:number, e:number, ep:number, price:number, exprice:number, divyield:number, r2:number, lr2:number, e3:number, predictpe:number, order:number, ma:number, dataArr?:number[]}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      item.dataArr = dataArray;
      let sl = new SlrForEarning(dataArray);
      //let ep = GFunc.evaluatePricePrice(irate, sl.predict(5), sl.predict(6), sl.predict(7));
      item.ep = (sl.predict(4) + item.e) / 2;
      item.v = GFunc.calculateVN(sl.slopeR, item.ep, item.divyield * item.price, item.exprice);
      item.e3 = sl.predict(7);
    }
    if (queryName === 'all') {
      this.cApp.sortStocks(arr);
      this.avgs = GFunc.CalculateValueAvg(arr);
    }
    else {
      this.avgs = {};
    }
    this.items.clear();
    this.items.push(...arr);
  }

  onSelectItem = async (item:any, isSelected:boolean) => {
    let tagid = this.cApp.defaultListTagID;
    if (isSelected === true) {
      await this.cApp.miApi.call('t_tagstock$add', [this.user.id, tagid, item.id]);
      await this.cApp.AddTagStockID(tagid, item.id);
    }
    else {
      await this.cApp.miApi.call('t_tagstock$del', [this.user.id, tagid, item.id]);
      await this.cApp.RemoveTagStockID(tagid, item.id);
    }
  }

  setSortType = (type:string) => {
    this.cApp.setUserSortType(type);
    let arr = this.items.slice();
    this.cApp.sortStocks(arr);

    this.items.replace(arr);
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