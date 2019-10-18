/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { CApp, CUq, Controller, VPage, CAppBase, IConstructor } from 'tonva';
import { CHome } from './home';
import { consts } from './consts';
import { observable, computed } from 'mobx';
import { nav } from 'tonva';
import { MiApi } from './net';
import { VHome } from './ui';
import { CUqBase } from './CUqBase';
import { CExplorer } from './explorer';
import { UQs } from './uqs';
import { MiConfigs } from './types';

export const defaultTagName = '自选股';
export const defaultBlackListTagName = '黑名单';

export class CMiApp extends CAppBase {
  cExporer: CExplorer;
  cHome: CHome;
  miApi: MiApi;
  @observable config: MiConfigs = { tagName: defaultTagName };
  @observable tags: any[] = undefined;

  get uqs(): UQs { return this._uqs as UQs };

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

  get blackListTagID(): number {
    if (this.tags !== undefined) {
      let name = this.config.tagName;
      let i = this.tags.findIndex(v => v.name === defaultBlackListTagName);
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
    this.cHome = this.newC(CHome);

    //some test code
    //let params = [];
    //let ret = await this.miApi.page('q_stocksquery', params, 0, 100);
    let env = process.env;
    //
    await this.loadConfig();
    this.openVPage(VHome);
  }

  async saveConfig() {
    let v = JSON.stringify(this.config);
    let param = {
      user: this.user.id,
      arr1: [
        { name: 'config', value: v }
      ]
    };
    await this.uqs.mi.UserSettings.add(param);
  }

  protected async loadConfig() {
    let rets = await Promise.all([this.loadTags(),
        this.uqs.mi.UserSettings.query({ user: this.user.id, name: 'config' })]);
    let r = rets[1];
    if (r !== undefined) {
      let ret = r.ret;
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
  }

  selectTag = async (item:any) => {
    let {name, id} = item as {name:string, id:number};
    let i = this.tags.findIndex(v => v.name === name);
    if (i >= 0) {
      this.config.tagName = name;
      this.saveConfig();
    }
  }

  protected async loadTags(): Promise<void> {
    if (this.tags === undefined) {
      let r = await this.uqs.mi.AllTags.query(undefined);
      let ret = r.ret;
      let bc = await this.checkDefaultTags(ret);
      if (bc) {

        r = await this.uqs.mi.AllTags.query(undefined);
        ret = r.ret;
      }
      this.tags = ret;
    }
  }

  protected async checkDefaultTags(list:any[]): Promise<boolean> {
    let br = false;
    if (list === undefined) {
      let param = {id: undefined, name: defaultTagName};
      await this.uqs.mi.SaveTag.submit(param);
      param = {id: undefined, name: defaultBlackListTagName};
      await this.uqs.mi.SaveTag.submit(param);
      br = true;
    }
    else {
      let param;
      let i = list.findIndex(v => v.name === defaultTagName);
      if (i < 0) {
        param = {id: undefined, name: defaultTagName};
        await this.uqs.mi.SaveTag.submit(param);
        br = true;
      }
      i = list.findIndex(v => v.name === defaultBlackListTagName);
      if (i < 0) {
        param = {id: undefined, name: defaultBlackListTagName};
        await this.uqs.mi.SaveTag.submit(param);
        br = true;
      }
    }

    return br;
  }

  protected newC<T extends CUqBase>(type: IConstructor<T>): T {
    return new type(this);
  }

  public async showOneVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void> {
    await (new vp(this)).open(param);
  }

  protected onDispose() {
  }
}
