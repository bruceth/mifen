import * as React from 'react';
import { observable, IObservableArray, computed, isObservableArray } from 'mobx';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockEarning, StockRoe, StockCapitalearning, StockBonus, StockDivideInfo } from './StockInfoType';
import { VTags, VNewTag } from './VTags';
import { nav } from 'tonva';

export class CStockInfo extends CUqBase {
  readonly cApp: CMiApp;
  baseItem: NStockInfo;
  @observable protected loaded: boolean = false;

  @observable price : StockPrice;
  @observable roe: StockRoe;
  @observable tags: any[] = undefined;
  @observable stockTags:any[];
  selectedTags: any[];

  protected _earning: IObservableArray<StockEarning> = observable.array<StockEarning>([], { deep: true});
  protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true});
  protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true});
  protected _divideInfo: IObservableArray<StockDivideInfo> = observable.array<StockDivideInfo>([], { deep: true});
  
  @computed get earning(): IObservableArray<StockEarning> {
    if (this.loaded === false) return undefined;
    return this._earning;
  }

  @computed get capitalearning(): IObservableArray<StockCapitalearning> {
    if (this.loaded === false) return undefined;
    return this._capitalearning;
  }

  @computed get bonus(): IObservableArray<StockBonus> {
    if (this.loaded === false) return undefined;
    return this._bonus;
  }

  @computed get divideInfo(): IObservableArray<StockDivideInfo> {
    if (this.loaded === false) return undefined;
    return this._divideInfo;
  }

  loadData = () => {
    this.loading();
  }

  async loadTags():Promise<void> {
    if (this.tags === undefined) {
      let ret = await this.uqs.mi.AllTags.query(undefined);
      this.tags = ret.ret;
    }
  }

  loading = async () => {
    if (!this.baseItem)
      return;
    let { id } = this.baseItem;
    let rets = await Promise.all([
      this.cApp.miApi.query('q_stockallinfo', [id]),
      this.uqs.mi.TagStock.query({user: nav.user.id, stock: id})
    ]);
    this.stockTags = rets[1].ret;
    let ret = rets[0];
    if (Array.isArray(ret[0])) {
      let arr1 = ret[1];
      if (Array.isArray(arr1)) {
        this.price = arr1[0];
      }

      let arr2 = ret[2];
      if (Array.isArray(arr2)) {
        this.roe = arr2[0];
      }

      if (this._earning.length > 0) {
        this._earning.clear();
      }
      let arr3 = ret[3];
      if (Array.isArray(arr3)) {
        this._earning.push(...arr3);
      }

      if (this._capitalearning.length > 0) {
        this._capitalearning.clear();
      }
      let arr4 = ret[4];
      if (Array.isArray(arr4)) {
        this._capitalearning.push(...arr4);
      }

      if (this._bonus.length > 0) {
        this._bonus.clear();
      }
      let arr5 = ret[5];
      if (Array.isArray(arr5)) {
        this._bonus.push(...arr5);
      }

      if (this._divideInfo.length > 0) {
        this._divideInfo.clear();
      }
      let arr6 = ret[6];
      if (Array.isArray(arr6)) {
        this._divideInfo.push(...arr6);
      }
    }

    this.loaded = true;
  }

  async internalStart(param: any) {
    this.baseItem = param as NStockInfo;
    this.loadData();
    this.openVPage(VStockInfo);
  }

  openMetaView = () => {
  }

  onTags = async () => {
    await this.loadTags();
    this.selectedTags = this.tags.filter(v => {
      let i = this.stockTags.findIndex(st => st.tag.id === v.id);
      return i>=0;
    });
    //await this.loadTags();
    this.openVPage(VTags);
  }

  onNewTag = () => {
    this.openVPage(VNewTag);
  }

  onSaveNewTag = async (data:any) => {
    let {name} = data;
    let param = {id: undefined, name: name};
    let ret = await this.uqs.mi.SaveTag.submit(param);
    let {retId} = ret;
    if (retId < 0) {
      alert(name + ' 已经被使用了');
      return;
    }
    this.tags.push({id: retId, name: name});
    this.closePage();
  }

  onTaged = async (tag: any, isSelected: boolean) => {
    let param = {
      user: nav.user.id,
      tag: tag.id,
      arr1: [
        {stock: this.baseItem.id}
      ]
    };
    if (isSelected === true) {
      let ret = await this.uqs.mi.TagStock.add(param);
      let newTag = {
        tag: {
          id: tag.id,
        }
      }
      this.stockTags.push(newTag);
    }
    else {
      let ret = await this.uqs.mi.TagStock.del(param);
      let i = this.stockTags.findIndex(v=>v.tag.id === tag.id);
      this.stockTags.splice(i, 1);
    }
  }
}
