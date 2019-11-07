/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems } from 'tonva';
import { observable, IObservableArray, autorun } from 'mobx';
import { CUqBase, CUqSub } from '../CUqBase';
import { IdName } from '../types';
import { CAccountHome } from './CAccountHome';
import { VAccountHome } from './VAccountHome';
import { VNewAccount, VEditAccount, VSelectAccounts } from './VSelectAccount';
import { VInitAccount } from './VInitAccount';

export class CAccountInit extends CUqSub {
  protected account: IdName;
  @observable accountInit: any;

  InitData(account:IdName, data:any) {
    this.account = account;
    this.accountInit = data;
  }
  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  open() {
    this.openVPage(VInitAccount);
  }
}