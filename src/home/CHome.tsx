/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { observable, IObservableArray, autorun } from 'mobx';
import { ErForEarning, SlrForEarning } from 'regression';
import { UserTag } from '../types';
import { CMiApp } from '../CMiApp';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';

// class HomePageItems extends PageItems<any> {
//   cHome: CHome;
//   constructor(cHome: CHome) {
//     super(true);
//     this.cHome = cHome;
//     this.pageSize = 30;
//     this.firstSize = 30;
//   }

//   protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
//     let queryName = 'tagpe';
//     if (this.cHome.cApp.config.userStock.sortType === 'tagdp') {
//       queryName = 'tagdp';
//     }

//     let query = {
//       name: queryName,
//       pageStart: pageStart,
//       pageSize: pageSize,
//       user: this.cHome.user.id,
//       tag: param.tag,
//       yearlen: 1,
//     };
//     let result = await this.cHome.cApp.miApi.process(query, []);
//     if (Array.isArray(result) === false) return [];
//     return result as any[];
//   }

//   protected setPageStart(item: any) {
//     this.pageStart = item === undefined ? 0 : item.order;
//   }

//   resetStart() {
//     this.pageStart = 0;
//   }

//   RemoveStock(stockID:number) {
//     let i = this._items.findIndex(v=>{return v.id === stockID})
//     if (i >= 0) {
//       this._items.splice(i, 1);
//     }
//   }
// }

export class CHome extends CUqBase {
  //PageItems: HomePageItems = new HomePageItems(this);
  items: IObservableArray<any> = observable.array<any>([], { deep: true });
  userTag: UserTag;
  protected oldSortType: string;
  @observable warnings: any[] = [];

  disposeAutorun = autorun(async () => {
    let needLoad = false;
    let oldID = this.userTag && this.userTag.tagID;
    this.userTag = { tagName: this.cApp.config.tagName, tagID: this.cApp.tagID };
    if (oldID !== this.userTag.tagID) {
      needLoad = true;
    }

    let newSortType = this.cApp.config.userStock.sortType;
    if (this.oldSortType === undefined) {
      this.oldSortType = newSortType;
    }
    else if (this.oldSortType !== newSortType) {
      this.oldSortType = newSortType;
      needLoad = true;
    }

    if (needLoad) {
      await this.load();
    }
  });

  public AddTagStockID(tagid: number, stockID: number) {
    if (this.userTag && this.userTag.tagID === tagid) {
      this.load();
    }
  }

  public RemoveTagStockID(tagid: number, stockID: number) {
    if (this.userTag && this.userTag.tagID === tagid) {
      //this.PageItems.RemoveStock(stockID);
      let i = this.items.findIndex(v=>{return v.id === stockID})
     if (i >= 0) {
       this.items.splice(i, 1);
     }
    }
  }


  onSelectTag = async () => {
    this.openVPage(VSelectTag);
  }


  onClickTag = async (item:any) => {
    await this.cApp.selectTag(item);
    this.closePage();
  }

  onPage = () => {
    //this.PageItems.more();
  }

  onWarningConfg = () => {
    this.cApp.cWarning.onWarningConfg();
  }


  // async searchMain(key: any) {
  //   if (key !== undefined) await this.PageItems.first(key);
  // }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  async load() {
    let tagID = this.cApp.tagID;
    if (tagID > 0) {
      await this.loadItems();
    }
  }

  async loadItems() {
    let queryName = 'tagpe';
    let sortType = this.cApp.config.userStock.sortType;
    if (sortType === 'tagdp') {
      queryName = 'tagdp';
    }

    let query = {
      name: queryName,
      pageStart: 0,
      pageSize: 1000,
      user: this.user.id,
      tag: this.cApp.tagID,
      yearlen: 1,
    };
    let result = await this.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) {
      return;
    };
    let {predictyear} = this.cApp.config.regression;
    let arr = result as {id:number, order:number, data?:string, e:number, price:number, r2:number, lr2:number, predictep?:number,predictepe?:number,predicteps?:number, ma:number}[];
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
    if (sortType === 'tagpredict') {
      arr.sort((a, b) => {
        return b.predictep - a.predictep;
      })
      let o = 1;
      for (let item of arr) {
        item.order = o;
        ++o;
      }

    }
    this.items.clear();
    this.items.push(...arr);
  }

  async loadWarning() {
    let r = await this.cApp.miApi.query('q_warnings', [this.cApp.user.id]);
    if (r !== undefined && Array.isArray(r)) {
      this.warnings = r;
    }
    else {
      if (this.warnings.length > 0) {
        this.warnings = [];
      }
    }
  }

  renderSiteHeader = () => {
    return this.renderView(VSiteHeader);
  }

  renderSearchHeader = (size?: string) => {
    return this.renderView(VSearchHeader, size);
  }


  renderHome = () => {
    return this.renderView(VHome);
  }

  openMetaView = () => {
  }

  tab = () => <this.renderHome />;

  openStockInfo = (item: NStockInfo) => {
    let cStockInfo = this.newC(CStockInfo);
    cStockInfo.start(item);
  }
}