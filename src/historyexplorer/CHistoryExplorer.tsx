/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, autorun } from 'mobx';
import * as React from 'react';
import { ErForEarning, SlrForEarning } from 'regression';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VHistoryExplorer } from './VHistoryExplorer';
import { GFunc } from 'GFunc';

export class CHistoryExplorer extends CUqBase {
  items: IObservableArray<any> = observable.array<any>([], { deep: true });
  @observable predictAvg: number;
  protected oldSelectType: string;
  selectedItems: any[] = [];
  day: number;

  async internalStart(param: any) {
  }

  async load() {
    this.selectedItems = [];
    await this.loadItems();
  }

  async loadItems() {
    if (this.day === undefined)
      return;
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, irate} = this.cApp.config.regression;
    let params = [this.day, bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210];
    let result = await this.cApp.miApi.call('t_predictep', params)
    if (Array.isArray(result) === false) {
      return;
    };
    let arr = result as {id:number, data?:string, e:number, price:number, capital:number, bonus:number, pe?:number, roe?:number, divyield?:number, r2:number, lr2:number, predictpp?:number, ma?:number}[];
    for (let item of arr) {
      item.pe = item.price / item.e;
      item.roe = item.e / item.capital;
      item.divyield = item.bonus / item.price;
      let dataArray = JSON.parse(item.data) as number[];
      let sl = new SlrForEarning(dataArray);
      let ep = GFunc.evaluatePricePrice(irate, sl.predict(5), sl.predict(6), sl.predict(7));
      item.predictpp = item.price / ep;
    }
    arr.sort((a, b) => {
      return a.predictpp - b.predictpp;
    })
    let o = 1;
    for (let item of arr) {
      item.ma = o;
      ++o;
    }
    let count = arr.length;
    if (count > 50)
      count = 50
    if (count >= 10) {
      let sum = 0;
      for (let i = 3; i < count; ++i) {
        sum += arr[i].predictpp
      }
      this.predictAvg = sum / (count - 3);
    }
    else {
      this.predictAvg = undefined;
    }
    this.items.clear();
    this.items.push(...arr);
  }

  renderHome = () => {
    return this.renderView(VHistoryExplorer);
  }


  openMetaView = () => {
  }

  tab = () => <this.renderHome />;

  openStockInfo = (item: NStockInfo) => {
    let cStockInfo = this.newC(CStockInfo);
    let bi = {...item};
    bi.day = this.day;
    cStockInfo.start(bi);
  }
}