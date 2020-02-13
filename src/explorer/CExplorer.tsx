/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed } from 'mobx';import * as React from 'react';
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

  async load() {
    this.selectedItems = [];
    await this.loadItems();
  }

  async loadItems() {
    let queryName = 'dvperoe';
    let sName = this.cApp.config.stockFind.selectType;
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, predictyear} = this.cApp.config.regression;
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
    let result = await this.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) {
      return;
    };
    let arr = result as {id:number, data?:string, e:number, price:number, r2:number, lr2:number, predictep?:number,predictepe?:number,predicteps?:number, ma:number}[];
    for (let item of arr) {
      let dataArray = JSON.parse(item.data) as number[];
      try {
        let esum = 0;
        let er = new ErForEarning(dataArray);
        let yearend = 4 + predictyear;
        for (let i = 5; i <= yearend; ++i) {
          esum += er.predict(i);
        }
        item.predictepe = GFunc.predictCutRatio(er.r2) * esum / item.price;
        let sl = new SlrForEarning(dataArray);
        esum = 0;
        for (let i = 5; i <= yearend; ++i) {
          esum += sl.predict(i);
        }
        item.predicteps = GFunc.predictCutRatio(sl.r2) * esum / item.price;
        item.predictep = item.r2 > item.lr2?item.predictepe:item.predicteps;
      }
      catch {
        item.predictep = item.e / item.price;
        item.predictepe = item.e / item.price;
        item.predicteps = item.e / item.price;
      }
    }
    if (queryName === 'all') {
      arr.sort((a, b) => {
        return b.predictep - a.predictep;
      })
      let o = 1;
      for (let item of arr) {
        item.ma = o;
        ++o;
      }
    }
    this.items.clear();
    this.items.push(...arr);
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