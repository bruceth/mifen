/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems, Context } from 'tonva';
import { observable, autorun } from 'mobx';
import { CMiApp } from '../CMiApp';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { CStock } from '../stock';
import { VWarningConfig, VNewWarning } from './VWarningConfig';

export class CWarning extends CUqBase {
  get cApp(): CMiApp { return this._cApp as CMiApp };
  @observable warnings:any[] = [];

  async internalStart(param: any) {
    let a = 1;
  }

  async loadWarnings() {
    let r = await this.cApp.miApi.call('t_stockwarning$all', [this.user.id]);//await this.uqs.mi.StockWarningAll.query(undefined);
    let ret = r as any[];
    this.warnings = ret;
  }

  onNewWarning = () => {
    this.openVPage(VNewWarning);
  }

  onWarningConfg = async () => {
    await this.loadWarnings();
    this.openVPage(VWarningConfig);
  }

  onSaveNewWarning = async (data: any) => {
    let { id, type, price } = data;
    // let param = {
    //   user: this.cApp.user.id,
    //   stock: id,
    //   arr1: [
    //     { type: type, price: price }
    //   ]};
    //let ret = await this.uqs.mi.StockWarning.add(param);
    await this.cApp.miApi.call('t_stockwarning$add', [this.cApp.user.id, id.id, type, price]);
    this.closePage();
  }

  onSaveWarning = async (data: any) => {

  }

  showSelectStock = async (context: Context, name: string, value: number): Promise<any> => {
    let cStock = new CStock(this.cApp);
    return await cStock.call();
  }
}