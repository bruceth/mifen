/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable } from 'mobx';
import { CUqBase } from "../uq-app";
import { VMarketPE } from './VMarketPE';

export class CMarketPE extends CUqBase {
    @observable historyData:{day:number, pe:number, e:number}[] =  [];
    private longshortFlag:number = 0;

    async internalStart(param: any) {
        this.loadData();
        this.openVPage(VMarketPE as any);
    }

    loadData = async () => {
        let dt = new Date();
        let param = [dt.getFullYear()*10000+(dt.getMonth()+1)*100+dt.getDate(), 750, this.longshortFlag];
        //let rets = await this.cApp.store.miApi.query('q_marketpe', param) as {day:number, pe:number, e:number}[];
		let rets = await this.cApp.miNet.q_marketpe(param);
        this.historyData = rets.reverse();
    }

    onLongShortFlag(f:number) {
        if (f === this.longshortFlag)
            return;
        this.longshortFlag = f;
        this.loadData();
    }
}