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
  @observable avgs : {avg20?:number, avg50?:number, avg100?:number} = {};
  protected oldSelectType: string;
  selectedItems: any[] = [];
  day: number;
  resultday: number;

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
    if (Array.isArray(result) === false && Array.isArray(result[0])) {
      return;
    };
    this.resultday = result[1][0].day;
    let arr = result[0] as {id:number, data?:string, e:number, price:number, capital:number, bonus:number, pe?:number, roe?:number, divyield?:number, r2:number, lr2:number, predictpp:number, order?:number, ma?:number}[];

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
      item.order = o;
      item.ma = o;
      ++o;
    }
    this.avgs = GFunc.CalculatePredictAvg(arr);
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