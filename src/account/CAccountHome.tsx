/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { observable, IObservableArray, autorun } from 'mobx';
import { CUqBase } from '../CUqBase';
import { IdName } from '../types';
import { VAccountHome, VLockAccountConfirm } from './VAccountHome';
import { VNewAccount, VEditAccount, VSelectAccounts } from './VSelectAccount';
import { VInitAccount } from './VInitAccount';
import { CAccountInit } from './CAccountInit';

export class CAccountHome extends CUqBase {
  protected account: IdName;
  @observable accountInit: any;
  @observable accountLast: any;
  protected initController: CAccountInit;

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
    
    await Promise.all([this.loadAccountInit(),
      this.loadAccountLast()]);
  }

  protected async loadAccountInit() {
    if (this.account === undefined || this.account.id <= 0)
      return;
    let r = await this.cApp.miApi.query('t_accountinitial$query', [this.account.id]);
    let ainit = r as any[];
    if (ainit.length <= 0) {
      let dt = new Date();
      this.accountInit = {
        id: this.account.id as number, 
        marketvalue: 0,
        money: 0, 
        share: undefined, 
        lock: 0,
        detail: [],
        datetime: Math.floor(dt.getTime() / 1000)
      }
    }
    else {
      let rd = ainit[0];
      let initData = { id: rd.id as number, 
        marketvalue: rd.marketvalue as number,
        money: rd.money as number,
        share: rd.share as number, 
        lock: rd.lock as number,
        detail: JSON.parse(rd.detail),
        datetime: rd.datetime
      }
      this.accountInit = initData;
    }
  }

  protected async loadAccountLast() {
    if (this.account === undefined || this.account.id <= 0)
      return;
    let r = await this.cApp.miApi.query('t_accountlast$queryall', [this.account.id]);
    let r1 = r[0][0];
    if (r1 === undefined) {
      this.accountLast = undefined;
      return;
    }
    let lastData = {
      id: this.account.id,
      marketvalue: r1.marketvalue,
      money: r1.money,
      share: r1.share,
      update: r1.update,
      detail: r[1]
    }

    let mv = lastData.money;
    lastData.detail.forEach(e => {
      mv += e.volume * e.price;
    });
    lastData.marketvalue = mv;

    this.accountLast = lastData;
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
    if (this.initController === undefined) {
      this.initController = new CAccountInit(this);
      this.initController.InitData(this.account, this.accountInit);
    }
    this.initController.open();
  }

  onClickLockInit = () => {
    this.openVPage(VLockAccountConfirm);
  }

  onClickLockInitConfirm = async () => {
    let details = [];
    let dt = new Date();
    this.accountInit.detail.forEach(e => {
      let item = [e.id.id, e.volume, e.price];
      details.push(item);
    });
    let param = [this.account.id,
      this.accountInit.marketvalue,
      this.accountInit.money,
      this.accountInit.share,
      Math.floor(dt.getTime() / 1000),
      JSON.stringify(details),
      1
      ];
    let r = await this.cApp.miApi.call('t_accountlast$savefull', param);
    await this.loadAccountLast();
    this.accountInit.lock = 1;
    this.closePage();
  }
}