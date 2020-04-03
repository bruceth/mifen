/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed } from 'mobx';
import * as React from 'react';
import { autorun } from 'mobx';
import { ErForEarning, SlrForEarning } from 'regression';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { GFunc } from 'GFunc';
import { VMarketPE } from './VMarketPE';

export class CMarketPE extends CUqBase {
    @observable historyData:{day:number, pe:number, e:number}[] =  [];
    private longshortFlag:number = 0;

    async internalStart(param: any) {
        this.loadData();
        this.openVPage(VMarketPE);
    }

    loadData = async () => {
        let dt = new Date();
        let param = [dt.getFullYear()*10000+(dt.getMonth()+1)*100+dt.getDate(), 750, this.longshortFlag];
        let rets = await this.cApp.miApi.query('q_marketpe', param) as {day:number, pe:number, e:number}[];
        this.historyData = rets.reverse();
    }

    onLongShortFlag(f:number) {
        if (f === this.longshortFlag)
            return;
        this.longshortFlag = f;
        this.loadData();
    }
}