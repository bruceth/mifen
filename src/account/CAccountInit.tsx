/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, NumSchema } from 'tonva';
import { observable, IObservableArray, autorun, computed } from 'mobx';
import { CUqBase, CUqSub } from '../CUqBase';
import { IdName } from '../types';
import { CAccountHome } from './CAccountHome';
import { VAccountHome } from './VAccountHome';
import { VNewAccount, VEditAccount, VSelectAccounts } from './VSelectAccount';
import { VInitAccount, VInitAccountEditDetail } from './VInitAccount';
import { CStock } from '../stock';

export class CAccountInit extends CUqSub {
  protected account: IdName;
  @observable accountInit: any;

  InitData(account:IdName, data:any) {
    this.account = account;
    this.accountInit = data;
  }

  @computed get MarketValue():number {
    let r = this.accountInit.money;
    this.accountInit.detail.forEach(element => {
      let {volume, price} = element as {volume:number, price:number};
      r += volume * price;
    });
    return r;
  }

  //作为tabs中的首页，internalStart不会被调用
  async internalStart(param: any) {
  }

  open() {
    this.openVPage(VInitAccount);
  }

  showSelectStock = async (context: Context, name: string, value: number): Promise<any> => {
    let cStock = new CStock(this.cApp);
    return await cStock.call();
  }


  onAddDetail = () => {
    this.openVPage(VInitAccountEditDetail)
  }

  onClickEditItem = (item: any) => {
    this.openVPage(VInitAccountEditDetail, item);
  }

  onUpdateDetailItem = (item:any) => {
    let {id, volume, price} = item;
    let di = {
        id:{ id: id.id, name:id.name, code:id.code, market:id.market, symbol:id.symbol },
        volume: volume,
        price: price
      }
    let i = this.accountInit.detail.findIndex(v => v.id.id === item.id.id);
    if (i < 0) {
      this.accountInit.detail.push(di);
    }
    else {
      this.accountInit.detail[i] = di;
    }
    this.closePage();
  }

  onMoneyChanged(value:number) {
    this.accountInit.money = value;
  }

  onShareChanged(value:number) {
    this.accountInit.share = value;
  }

  onSaveInit = async () => {
    let dt = new Date();
    let param = [this.account.id, 
        this.MarketValue,
        this.accountInit.money,
        this.accountInit.share,
        JSON.stringify(this.accountInit.detail),
        Math.floor(dt.getTime()/1000)
      ];
    let r = await this.cApp.miApi.call('t_accountinitial$save', param);
    let o = this.owner as CAccountHome;
    await o.load();
    this.closePage();
  }
}