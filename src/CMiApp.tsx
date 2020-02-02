/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, computed } from 'mobx';
import { CApp, CUq, Controller, VPage, CAppBase, IConstructor } from 'tonva';
import { CHome } from './home';
import { consts } from './consts';
import { MiApi } from './net';
import { VHome } from './ui';
import { CUqBase } from './CUqBase';
import { CExplorer } from './explorer';
import { CHistoryExplorer } from './historyexplorer'
import { MiConfigs, StockFindConfig, IdName, RegressionConfig } from './types';
import { CWarning } from './warning';
import { CAccountHome } from './account';

export const defaultTagName = '自选股';
export const defaultBlackListTagName = '黑名单';

export class CMiApp extends CAppBase {
  cExporer: CExplorer;
  cHistoryExplorer: CHistoryExplorer;
  cHome: CHome;
  cWarning: CWarning;
  cAccountHome: CAccountHome;
  miApi: MiApi;
  @observable config: MiConfigs = { 
    tagName: defaultTagName, 
    stockFind: { sortType:'pe' },
    userStock: { sortType:'tagpe'},
    regression: {bmin:0, bmax:0.5, r2:0.6, lmin:0.01, lmax:0.5, lr2:0.6, mcount:2, lr4: 2, predictyear:3}
  };
  @observable tags: IdName[] = undefined;
  @observable blackList: any[] = [];
  @observable defaultList: any[] = [];
  @observable accounts: IdName[] = undefined;

  @computed get tagID(): number {
    if (this.tags !== undefined) {
      let name = this.config.tagName;
      let i = this.tags.findIndex(v => v.name === name);
      if (i >= 0) {
        return this.tags[i].id as number;
      }
    }
    return -1;
  }

  @computed get accountID(): number {
    let name = this.config.accountName;
    if (name !== undefined && this.accounts !== undefined) {
      let i = this.accounts.findIndex(v => v.name === name);
      if (i >= 0) {
        return this.accounts[i].id as number;
      }
    }
    return -1;
  }

  get findStockConfg(): StockFindConfig {
    return this.config.stockFind;
  }

  @computed get blackListTagID(): number {
    if (this.tags !== undefined) {
      let name = this.config.tagName;
      let i = this.tags.findIndex(v => v.name === defaultBlackListTagName);
      if (i >= 0) {
        return this.tags[i].id as number;
      }
    }
    return -1;
  }

  @computed get defaultListTagID(): number {
    if (this.tags !== undefined) {
      let name = this.config.tagName;
      let i = this.tags.findIndex(v => v.name === defaultTagName);
      if (i >= 0) {
        return this.tags[i].id as number;
      }
    }
    return -1;
  }

  protected async internalStart() {
    if (this.isLogined) {
    }

    let token = this.user.token;

    let miHost = consts.isDevelopment ? consts.miApiHostDebug : consts.miApiHost;
    this.miApi = new MiApi(miHost, 'fsjs/', 'miapi', token, false);
    this.cExporer = this.newC(CExplorer);
    this.cHistoryExplorer = this.newC(CHistoryExplorer);
    this.cHome = this.newC(CHome);
    this.cAccountHome = this.newC(CAccountHome);
    this.cWarning = this.newC(CWarning);

    //some test code
    //let params = [];
    //let ret = await this.miApi.page('q_stocksquery', params, 0, 100);
    let env = process.env;
    //
    await this.loadConfig();
    this.cHome.loadWarning();
    this.openVPage(VHome);
  }

  async saveConfig() {
    let v = JSON.stringify(this.config);
    await this.miApi.call('t_usersettings$save', [this.user.id, 'config', v]);
  }

  protected async loadConfig() {
    let rets = await Promise.all([this.miApi.query('t_usersettings$query', [this.user.id, 'config']),
        this.loadTags(),
        this.loadAccounts()]);
    let r = rets[0];
    if (r !== undefined) {
      let ret = r;
      if (ret !== undefined && ret.length > 0) {
        let cStr = ret[0].value;
        let c = JSON.parse(cStr);
        if (this.tags !== undefined) {
          let name = c.tagName;
          let i = this.tags.findIndex(v => v.name === name);
          if (i < 0 && this.tags.length > 0) {
            i = this.tags.findIndex(v => v.name === defaultTagName);
            if (i >= 0) {
              c.tagName = defaultTagName;
            }
            else {
              c.tagName = this.tags[0].name;
            }
          }
        }
        this.config = c;
      }
    }
    if (this.config.stockFind === undefined) {
      this.config.stockFind = { sortType: 'pe' };
    }
    if (this.config.userStock === undefined) {
      this.config.userStock = { sortType: 'tagpe' };
    }
    if (this.config.regression === undefined) {
      this.config.regression = {bmin:0, bmax:0.5, r2:0.6, lmin:0.01, lmax:0.5, lr2:0.6, mcount:2, lr4: 2, predictyear:3};
    }
    await this.loadBlackList();
    await this.loadDefaultList();
  }

  setStockSortType = async (type:string)=> {
    if (this.config.stockFind.sortType === type)
      return;
    this.config.stockFind.sortType = type;
    await this.saveConfig();
  }

  setStockSelectType = async (type:string) => {
    if (this.config.stockFind.selectType === type)
      return;
    this.config.stockFind.selectType = type;
    await this.saveConfig();
  }

  setUserSortType = async (type:string)=> {
    if (this.config.userStock.sortType === type)
      return;
    this.config.userStock.sortType = type;
    await this.saveConfig();
  }

  selectTag = async (item:any) => {
    let {name, id} = item as {name:string, id:number};
    let i = this.tags.findIndex(v => v.name === name);
    if (i >= 0) {
      this.config.tagName = name;
      this.saveConfig();
    }
  }

  selectAccount = async (item:any) => {
    let {name, id} = item as {name:string, id:number};
    let i = this.accounts.findIndex(v => v.name === name);
    if (i >= 0) {
      this.config.accountName = name;
      this.saveConfig();
    }
  }

  setRegressionConfig = async (cfg: RegressionConfig) => {
    this.config.regression = cfg;
    await this.saveConfig();
  }

  protected async loadTags(): Promise<void> {
    if (this.tags === undefined) {
      let r = await this.miApi.query('t_tag$all', [this.user.id]);
      let ret = r as any[];
      let bc = await this.checkDefaultTags(ret);
      if (bc) {
        r = await this.miApi.query('t_tag$all', [this.user.id]);
        ret = r as any[];
      }
      let r1 = [];
      let i = ret.findIndex(v=>v.name === defaultTagName);
      if (i >= 0) {
        r1.push(ret[i]);
        ret.splice(i, 1);
      }
      i = ret.findIndex(v=> v.name === defaultBlackListTagName);
      if (i >= 0) {
        r1.push(ret[i]);
        ret.splice(i, 1);
      }
      r1.push(...ret);
      this.tags = r1;
    }
  }

  protected async checkDefaultTags(list:any[]): Promise<boolean> {
    let br = false;
    if (list === undefined) {
      await this.miApi.call('t_tag$save', [this.user.id, undefined, defaultTagName]);
      await this.miApi.call('t_tag$save', [this.user.id, undefined, defaultBlackListTagName]);
      br = true;
    }
    else {
      let param;
      let i = list.findIndex(v => v.name === defaultTagName);
      if (i < 0) {
        await this.miApi.call('t_tag$save', [this.user.id, undefined, defaultTagName]);
        br = true;
      }
      i = list.findIndex(v => v.name === defaultBlackListTagName);
      if (i < 0) {
        await this.miApi.call('t_tag$save', [this.user.id, undefined, defaultBlackListTagName]);
        br = true;
      }
    }

    return br;
  }

  protected async loadAccounts(): Promise<void> {
    let r = await this.miApi.query('t_allaccounts', [this.user.id]);
    if (Array.isArray(r)) {
      this.accounts = r;
    }
  }

  protected async loadBlackList(): Promise<void> {
    let blackid = this.blackListTagID;
    if (blackid <= 0) {
      this.blackList = [];
      return;
    }

    let param = { user:this.user.id, tag:blackid};
    try {
      let ret = await this.miApi.call('t_tagstock$query', [this.user.id, blackid, undefined]);//await this.uqs.mi.TagStock.query(param);
      let r = ret.map(item=> {
        return item.stock;
      });
      this.blackList = r;
    }
    catch (error) {
      let e = error;
    }
  }

  protected async loadDefaultList(): Promise<void> {
    let id = this.defaultListTagID;
    if (id <= 0) {
      this.defaultList = [];
      return;
    }

    let param = { user:this.user.id, tag:id};
    try {
      let ret = await this.miApi.call('t_tagstock$query', [this.user.id, id, undefined]);//await this.uqs.mi.TagStock.query(param);
      let r = ret.map(item=> {
        return item.stock;
      });
      this.defaultList = r;
    }
    catch (error) {
      let e = error;
    }
  }

  async AddTagStockID(tagid: number, stockID: number) {
    if (tagid === this.blackListTagID) {
      this.AddBlackID(stockID);
    }
    else if (tagid === this.defaultListTagID) {
      this.AddDefaultID(stockID);
    }
  }

  async RemoveTagStockID(tagid: number, stockID: number) {
    if (tagid === this.blackListTagID) {
      this.RemoveBlackID(stockID);
    }
    else if (tagid === this.defaultListTagID) {
      this.RemoveDefaultID(stockID);
    }
    this.cHome.RemoveTagStockID(tagid, stockID);
  }

  protected AddBlackID(id:number) {
    let i = this.blackList.findIndex(v=> v===id);
    if (i < 0) {
      this.blackList.push(id);
    }
  }

  protected RemoveBlackID(id:number) {
    let i = this.blackList.findIndex(v=> v===id);
    if (i >= 0) {
      this.blackList.splice(i, 1);
    }
  }

  protected AddDefaultID(id:number) {
    let i = this.defaultList.findIndex(v=> v===id);
    if (i < 0) {
      this.defaultList.push(id);
    }
  }

  protected RemoveDefaultID(id:number) {
    let i = this.defaultList.findIndex(v=> v===id);
    if (i >= 0) {
      this.defaultList.splice(i, 1);
    }
  }

  newC<T extends CUqBase>(type: IConstructor<T>): T {
    return new type(this);
  }

  public async showOneVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void> {
    await (new vp(this)).open(param);
  }

  protected onDispose() {
  }
}
