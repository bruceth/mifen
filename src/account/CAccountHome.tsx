/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { observable, IObservableArray, autorun } from 'mobx';
import { CUqBase } from '../CUqBase';
import { IdName } from '../types';
import { VAccountHome } from './VAccountHome';
import { VNewAccount, VEditAccount, VSelectAccounts } from './VSelectAccount';
import { VInitAccount } from './VInitAccount';

export class CAccountHome extends CUqBase {
  protected account: IdName;
  @observable accountInit: any;
  @observable accountLast: any;

  disposeAutorun = autorun(async () => {
    let needLoad = false;
    let oldID = this.account !== undefined && this.account.id;
    this.account = { id: this.cApp.accountID, name: this.cApp.config.accountName };
    if (oldID !== this.account.id) {
      needLoad = true;
    }

    if (needLoad) {
      await this.load();
    }
  });

  async load() {
    if (this.account === undefined || this.account.id <= 0)
      return;
    
    let r = await this.cApp.miApi.query('q_accountinfo', [this.account.id]);
    let ainit = r[0] as any[];
    let alast = r[1] as any[];
    if (ainit.length <= 0) {
      this.accountInit = undefined;
    }
    else {
      let rd = ainit[0];
      let initData = { id: rd.id as number, 
        marketvalue:rd.marketvalue as number, 
        share:rd.share as number, 
        lock:rd.lock as number,
        detail:JSON.parse(rd.detail),
        datetime:rd.datetime
      }
      this.accountInit = initData;
    }
    if (alast.length <= 0) {
      this.accountLast = undefined;
    }
    else {
      let ld = alast[0];
      let lastData = { id: ld.id as number,
        marketvalue:ld.marketvalue as number, 
        share:ld.share as number, 
        detail:JSON.parse(ld.detail),
        update:ld.update
      };
      this.accountLast = lastData;
    }
  }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  tab = () => <this.renderAccounthome />;

  renderAccounthome = () => {
    return this.renderView(VAccountHome);
  }

  onClickSelectAccount = async (item:any) => {
    await this.cApp.selectAccount(item);
    this.closePage();
  }

  onEditAccount = (item:any) => {
    this.openVPage(VEditAccount, item);
  }

  onNewAccount = () => {
    this.openVPage(VNewAccount);
  }

  onSaveNewAccount = async (data:any) => {
    let { name } = data;
    let param = [undefined, this.cApp.user.id, name];
    let ret = await this.cApp.miApi.call('t_saveaccount', param);
    let { retId } = ret;
    if (retId < 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    this.cApp.accounts.push({ id: retId, name: name });
    return true;
  }

  onSaveAccount = async (data:any) => {
    let { id, name } = data;
    let param = [id, this.cApp.user.id, name];
    let i = this.cApp.accounts.findIndex(v => v.id !== id && v.name === name);
    if (i >= 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    let ret = await this.cApp.miApi.call('t_saveaccount', param);
    let { retId } = ret;
    if (retId === undefined || retId < 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    i = this.cApp.accounts.findIndex(v => v.id === id);
    if (i >= 0) {
      this.cApp.accounts[i].name = name;
    }
    return true;
  }

  onSelectAccount = () => {
    this.openVPage(VSelectAccounts);
  }

  onClickInit = () => {
    this.openVPage(VInitAccount);
  }
}