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
  @observable avgs : {avg20?:number, avg50?:number, avg100?:number, zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number} = {};
  @observable avgs20 : {zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number} = {};
  @observable avgs50 : {zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number} = {};
  @observable avgs100 : {zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number} = {};
  @observable zfsummary: {avg1?:number, avg2?:number, avg3?:number, gt1?:number, lt1?:number, gt2?:number, lt2?:number, gt3?:number, lt3?:number} = undefined;
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
    let result = await this.cApp.miApi.call('t_predictep', params);
    if (Array.isArray(result) === false && Array.isArray(result[0])) {
      return;
    };
    this.resultday = result[1][0].day;
    let arr = result[0] as {id:number, data?:string, e:number, price:number, capital:number, bonus:number, pe?:number, roe?:number, zf1?:number, zf2?:number, zf3?:number, divyield?:number, r2:number, lr2:number, predictpp:number, order?:number, ma?:number}[];

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
    let zf1 = 0;
    let zf2 = 0;
    let zf3 = 0;
    let count1 =0;
    let count2 = 0;
    let count3 = 0;
    let zc1 = 0;
    let zc2 = 0;
    let zc3 = 0;

    for (let item of arr) {
      item.order = o;
      item.ma = o;
      ++o;
      let zf = item.zf1;
      if (zf !== undefined) {
        zf1 += zf;
        count1++;
        if (zf > 0)
         zc1++;
      }
      zf = item.zf2;
      if (zf !== undefined) {
        zf2 += zf;
        count2++;
        if (zf > 0)
         zc2++;
      }
      zf = item.zf3;
      if (zf !== undefined) {
        zf3 += zf;
        count3++;
        if (zf > 0)
         zc3++;
      }
    }

    let avgs = GFunc.CalculatePredictAvg(arr) as {avg20?:number, avg50?:number, avg100?:number, zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number};
    avgs.zf1 = count1 > 0 ? zf1/count1 : undefined;
    avgs.zf2 = count2 > 0 ? zf2/count2 : undefined;
    avgs.zf3 = count3 > 0 ? zf3/count3 : undefined;
    avgs.zr1 = count1 > 0 ? zc1/count1 : undefined;
    avgs.zr2 = count2 > 0 ? zc2/count2 : undefined;
    avgs.zr3 = count3 > 0 ? zc3/count3 : undefined;
    this.avgs = avgs;
    this.items.clear();
    this.items.push(...arr);
    this.avgs20 = this.countAvgs(this.items, 20);
    this.avgs50 = this.countAvgs(this.items, 50);
    this.avgs100 = this.countAvgs(this.items, 100);
    await this.loadZFavg();
  }

  protected countAvgs(list:{zf1?:number, zf2?:number, zf3?:number}[], count:number) {
    let ret : {zf1?:number, zf2?:number, zf3?:number, zr1?:number, zr2?:number, zr3?:number} = {};
    let len = list.length;
    if (len > count) {
      len = count;
    }
    let zf1 = 0;
    let zf2 = 0;
    let zf3 = 0;
    let count1 =0;
    let count2 = 0;
    let count3 = 0;
    let zc1 = 0;
    let zc2 = 0;
    let zc3 = 0;
    for (let i = 0; i < len; ++i) {
      let item = list[i];
      let zf = item.zf1;
      if (zf !== undefined) {
        zf1 += zf;
        count1++;
        if (zf > 0)
         zc1++;
      }
      zf = item.zf2;
      if (zf !== undefined) {
        zf2 += zf;
        count2++;
        if (zf > 0)
         zc2++;
      }
      zf = item.zf3;
      if (zf !== undefined) {
        zf3 += zf;
        count3++;
        if (zf > 0)
         zc3++;
      }
    }
    ret.zf1 = count1 > 0 ? zf1/count1 : undefined;
    ret.zf2 = count2 > 0 ? zf2/count2 : undefined;
    ret.zf3 = count3 > 0 ? zf3/count3 : undefined;
    ret.zr1 = count1 > 0 ? zc1/count1 : undefined;
    ret.zr2 = count2 > 0 ? zc2/count2 : undefined;
    ret.zr3 = count3 > 0 ? zc3/count3 : undefined;

    return ret;
  }

  async loadZFavg() {
    if (this.resultday === undefined) {
      this.zfsummary = undefined;
      return;
    }
    let rets = await this.cApp.miApi.call('t_stockzf$summary', [this.resultday]) as any[][];
    let avgs = rets[0][0];
    let zfs: {avg1?:number, avg2?:number, avg3?:number, gt1?:number, lt1?:number, gt2?:number, lt2?:number, gt3?:number, lt3?:number} = {
      avg1:avgs.avg1, avg2:avgs.avg2, avg3:avgs.avg3,
      gt1:rets[1][0].gt1,
      lt1:rets[2][0].lt1,
      gt2:rets[3][0].gt2,
      lt2:rets[4][0].lt2,
      gt3:rets[5][0].gt3,
      lt3:rets[6][0].lt3,
    }

    this.zfsummary = zfs;
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