/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed } from 'mobx';
import * as React from 'react';
import { CUqBase } from '../CUqBase';
import { VPredictHistory } from './VPredictHistory'

export interface PredictHistoryParam {
  day?:number,
  priceDay?:number,
  avg20?:number,
  avg50?:number,
  avg100?:number
}

interface PredictItem {
  day:number, 
  avg20:number, 
  avg50:number,
  avg100:number
}

export class CPredictHistory extends CUqBase {
  items: IObservableArray<PredictItem> = observable.array<PredictItem>([], { deep: true });
  day: number;
  protected lastItem: PredictItem;

  async internalStart(param: any) {
    let p = param as PredictHistoryParam;
    if (p !== undefined) {
      this.day = p.day;
      if (p.priceDay !== undefined) {
        this.lastItem = {day:p.priceDay, avg20:p.avg20, avg50:p.avg50, avg100:p.avg100};
      }
      else {
        this.lastItem = undefined;
      }
    }
    else {
      this.day = undefined;
      this.lastItem = undefined;
    }
    await this.load();
    this.openVPage(VPredictHistory);
  }

  async load() {
    let ret = await this.cApp.miApi.call('t_toppredictavg$query', [this.day]) as PredictItem[];
    this.items.clear();
    if (!Array.isArray(ret))
      return;
    this.items.push(...ret);
    if (this.lastItem !== undefined) {
      let li = {...this.lastItem};
      this.items.push(li);
    }
  }

}