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
    let sName = this.cApp.config.stockFind.selectType;
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, irate} = this.cApp.config.regression;
    if (sName !== undefined)
      queryName = sName;
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
    let arr = result as {id:number, data?:string, e:number, price:number, r2:number, lr2:number, predictpp:number, order:number, ma:number}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      let sl = new SlrForEarning(dataArray);
      let ep = GFunc.evaluatePricePrice(irate, sl.predict(5), sl.predict(6), sl.predict(7));
      item.predictpp = item.price / ep;
    }
    if (queryName === 'all') {
      arr.sort((a, b) => {
        return a.predictpp - b.predictpp;
      })
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