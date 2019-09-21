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
    let query = {
      name: 'tagpe',
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
  get app(): CMiApp { return this.cApp as CMiApp };

  disposeAutorun = autorun(async () => {
    let oldID = this.userTag && this.userTag.tagID;
    this.userTag = { tagName: this.app.config.tagName, tagID: this.app.tagID };
    if (oldID !== this.userTag.tagID) {
      await this.load();
    }
  });

  onTags = async () => {
    this.openVPage(VSelectTag);
  }


  onTaged = async (item:any) => {
    await this.app.selectTag(item);
    this.closePage();
  }

  onPage = () => {
    this.PageItems.more();
  }

  async searchMain(key: any) {
    if (key !== undefined) await this.PageItems.first(key);
  }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  async load() {
    let tagID = this.app.tagID;
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