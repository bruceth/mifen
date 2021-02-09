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
  @observable avgs : {avg20?:number, avg50?:number, avg100?:number} = {};
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
    let arr = result as {id:number, data?:string, v:number, pe:number, e:number, ep2:number, price:number, exprice:number, divyield:number, r2:number, lr2:number, e3:number, predictpe:number, order:number, ma:number}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      let sl = new SlrForEarning(dataArray);
      //let ep = GFunc.evaluatePricePrice(irate, sl.predict(5), sl.predict(6), sl.predict(7));
      item.v = GFunc.calculateV(sl.slopeR, item.divyield, item.exprice / item.e);
      item.ep2 = sl.predict(4);
      item.e3 = sl.predict(7);
      item.predictpe = item.exprice / item.e3;
    }
    if (queryName === 'all') {
      arr.sort(this.getsortFunc());
      let o = 1;
      for (let item of arr) {
        item.order = o;
        item.ma = o;
        ++o;
      }
      this.avgs = GFunc.CalculatePredictAvg(arr);
    }
    else {
      this.avgs = {};
    }
    this.items.clear();
    this.items.push(...arr);
  }

  onSelectItem = (item:any, isSelected:boolean) => {
    let index = this.selectedItems.findIndex(v=>v === item.id);
    if (index >= 0) {
      if (!isSelected) {
        this.selectedItems.splice(index, 1);
      }
    }
    else {
      if (isSelected) {
        this.selectedItems.push(item.id);
      }
    }
  }

  getsortFunc = () => {
    let sortType = this.cApp.config.userStock.sortType;
    if (sortType === 'tagpe') {
      return (a, b) => {
        return a.pe - b.pe;
      }
    }
    else if (sortType === 'tagdp') {
      return (a, b) => {
        return b.divyield - a.divyield;
      }
    }
    else if (sortType === 'tagv') {
      return (a, b) => {
        return b.v - a.v;
      }
    }
    else {
      return (a, b) => {
        return a.predictpe - b.predictpe;
      }
    }
  }

  setSortType = (type:string) => {
    this.cApp.setUserSortType(type);
    this.items.replace(this.items.slice().sort(this.getsortFunc()));
  }

  onAddSelectedItemsToTag = async () => {
    if (this.selectedItems.length <= 0)
      return;
    let tagid = this.cApp.defaultListTagID;
    let ret = await this.cApp.miApi.call('t_tagstock$addgroup', [this.user.id, tagid, JSON.stringify(this.selectedItems)]);
    await this.cApp.AddTagStockIDs(tagid, this.selectedItems);
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