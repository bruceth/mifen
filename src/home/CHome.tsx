/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { autorun } from 'mobx';
import { UserTag } from '../types';
import { CMiApp } from '../CMiApp';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';

class HomePageItems<T> extends PageItems<T> {
  cHome: CHome;
  constructor(cHome: CHome) {
    super(true);
    this.cHome = cHome;
    this.pageSize = 30;
    this.firstSize = 30;
  }

  protected async load(param: any, pageStart: any, pageSize: number): Promise<any[]> {
    let queryName = 'tagpe';
    if (this.cHome.cApp.config.userStock.sortType === 'tagdp') {
      queryName = 'tagdp';
    }

    let query = {
      name: queryName,
      pageStart: pageStart,
      pageSize: pageSize,
      user: this.cHome.user.id,
      tag: param.tag,
      yearlen: 1,
    };
    let result = await this.cHome.cApp.miApi.process(query, []);
    if (Array.isArray(result) === false) return [];
    return result as any[];
  }

  protected setPageStart(item: any) {
    this.pageStart = item === undefined ? 0 : item.order;
  }

  resetStart() {
    this.pageStart = 0;
  }
}

export class CHome extends CUqBase {
  PageItems: HomePageItems<any> = new HomePageItems<any>(this);
  userTag: UserTag;
  get cApp(): CMiApp { return this._cApp as CMiApp };
  protected oldSortType: string;

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

  onTags = async () => {
    this.openVPage(VSelectTag);
  }


  onTaged = async (item:any) => {
    await this.cApp.selectTag(item);
    this.closePage();
  }

  onPage = () => {
    this.PageItems.more();
  }

  onWarningConfg = () => {
    this.cApp.cWarning.onWarningConfg();
  }


  async searchMain(key: any) {
    if (key !== undefined) await this.PageItems.first(key);
  }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  async load() {
    let tagID = this.cApp.tagID;
    if (tagID > 0) {
      this.PageItems.reset();
      this.PageItems.resetStart();
      this.searchMain({ tag: tagID });
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