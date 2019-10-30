/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { PageItems, Context } from 'tonva';
import { observable, autorun } from 'mobx';
import { UserTag } from '../types';
import { CMiApp } from '../CMiApp';
import { CUqBase } from '../CUqBase';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VWarningConfig, VNewWarning } from './VWarningConfig';
import { CStock } from 'stock';

export class CWarning extends CUqBase {
  get cApp(): CMiApp { return this._cApp as CMiApp };
  @observable warnings:any[] = [];

  async internalStart(param: any) {
    let a = 1;
  }

  async loadWarnings() {
    
    let r = await this.uqs.mi.StockWarningAll.query(undefined);
    let ret = r.ret as any[];
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
    let param = {
      user: this.cApp.user.id,
      stock: id,
      arr1: [
        { type: type, price: price }
      ]};
    let ret = await this.uqs.mi.StockWarning.add(param);
    this.closePage();
  }

  onSaveWarning = async (data: any) => {

  }

  showSelectStock = async (context: Context, name: string, value: number): Promise<any> => {
    let cStock = new CStock(this.cApp);
    return await cStock.call();
  }
}