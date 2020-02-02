/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, autorun } from 'mobx';
import * as React from 'react';
import { ErForEarning, SlrForEarning } from 'regression';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VHistoryExplorer } from './VHistoryExplorer';

export class CHistoryExplorer extends CUqBase {
  items: IObservableArray<any> = observable.array<any>([], { deep: true });
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
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, predictyear} = this.cApp.config.regression;
    let params = [this.day, bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4];
    let result = await this.cApp.miApi.call('t_predictep', params)
    if (Array.isArray(result) === false) {
      return;
    };
    let arr = result as {id:number, data?:string, e:number, price:number, r2:number, lr2:number, predictep?:number,predictepe?:number,predicteps?:number, ma?:number}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      try {
        let esum = 0;
        let er = new ErForEarning(dataArray);
        let yearend = 4 + predictyear;
        for (let i = 5; i <= yearend; ++i) {
          esum += er.predict(i);
        }
        item.predictepe = (0.9 + Math.sqrt(er.r2) / 10) * esum / item.price;
        let sl = new SlrForEarning(dataArray);
        esum = 0;
        for (let i = 5; i <= yearend; ++i) {
          esum += sl.predict(i);
        }
        item.predicteps = (0.9 + Math.sqrt(sl.r2) / 10) * esum / item.price;
        item.predictep = item.r2 > item.lr2?item.predictepe:item.predicteps;
      }
      catch {
        item.predictep = item.e / item.price;
        item.predictepe = item.e / item.price;
        item.predicteps = item.e / item.price;
      }
    }
    arr.sort((a, b) => {
      return b.predictep - a.predictep;
    })
    let o = 1;
    for (let item of arr) {
      item.ma = o;
      ++o;
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
    cStockInfo.start(item);
  }
}