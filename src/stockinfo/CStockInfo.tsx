/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, makeObservable } from 'mobx';
import { CUqBase } from "../uq-app";
import { GFunc } from './GFunc';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockCapitalearning, StockBonus, StockDivideInfo } from './StockInfoType';
import { Stock, StockValue } from 'uq-app/uqs/BruceYuMi';
import { ErForEarning } from './ErForEarning';
import { SlrForEarning } from './SlrForEarning';
import { MiNet } from './net';

export class CStockInfo extends CUqBase {
    stock: Stock & StockValue;
    @observable baseItem: NStockInfo;
    @observable protected loaded: boolean = false;

    @observable price: StockPrice;
    @observable stockTags: any[];
    selectedTags: any[];

    @observable seasonData: { season: number, c: number, corg: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictSeasonData: { season: number, c: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictSeasonDataFull: { season: number, c: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictData: { e: number, b: number, r2: number, epre: number, l: number, lr2: number, lpre: number };
    @observable predictBonusData: { year: number, bonus: number }[] = [];
    @observable ypredict: number[] = [];

    protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true });
    protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true });
    protected _divideInfo: IObservableArray<StockDivideInfo> = observable.array<StockDivideInfo>([], { deep: true });
    protected _sharesArr: { day: number, shares: number }[] = [];

    @computed get capitalearning(): IObservableArray<StockCapitalearning> {
        if (this.loaded === false) return undefined;
        return this._capitalearning;
    }

    @computed get bonus(): IObservableArray<StockBonus> {
        if (this.loaded === false) return undefined;
        return this._bonus;
    }

    @computed get divideInfo(): IObservableArray<StockDivideInfo> {
        if (this.loaded === false) return undefined;
        return this._divideInfo;
    }

    private miNet: MiNet;
    constructor(cApp: any) {
        super(cApp);
        makeObservable(this);
        this.miNet = new MiNet(this.user);
    }
    initLoad = () => {
        this.load();
    }

    private load = async () => {
        if (!this.baseItem) return;

        let { id, day, } = this.baseItem;
        let rets = await Promise.all([
            this.miNet.q_stockallinfo(id, day),
            this.miNet.t_tagstock$query(undefined, id),
        ]);
        this.stockTags = rets[1];
        let ret = rets[0];
        if (Array.isArray(ret[0])) {
            let arr1 = ret[1];
            if (Array.isArray(arr1)) {
                this.price = arr1[0];
            }

            this._bonus.clear();
            this._divideInfo.clear();
            this._capitalearning.clear();
            let arr3 = ret[3];
            if (Array.isArray(arr3)) {
                this._divideInfo.push(...arr3);
                let barr = arr3.filter((v: any) => {
                    return v.派息 as number > 0;
                }).map((v: any) => {
                    return { day: v.day, bonus: v.派息, shares: v.shares };
                })
                this._bonus.push(...barr);
            }
            this._sharesArr = ret[5];

            await this.loadTTMEarning(ret[2]);
            this.LoadBonusData();
        }

        //this.isMySelect = this.cApp.store.isMyAll(this.stock);
        this.loaded = true;
    }

    protected getTotalShares(day: number): number {
        let ret: number = undefined;
        for (let i = 0; i < this._sharesArr.length; ++i) {
            let item = this._sharesArr[i];
            ret = item.shares;
            if (day >= item.day) {
                break;
            }
        }

        return ret;
    }

    protected async loadTTMEarning(list: { seasonno: number, capital: number, revenue: number, profit: number, netprofit: number, shares: number }[]) {
        this.seasonData.splice(0);
        let seasonlist: { [index: number]: { season: number, c: number, corg: number, shares: number, revenue: number, profit: number, netprofit: number } } = {};
        let len = list.length;
        if (len <= 0) return;
        let minNo = list[len - 1].seasonno;
        let lastItem = list[0];
        let lastShares = lastItem.shares;
        let maxNo = lastItem.seasonno;

        for (let item of list) {
            let no = item.seasonno;
            let sItem = {
                season: no, c: item.capital * item.shares / lastShares, 
                corg: item.capital, shares: item.shares, revenue: item.revenue, profit: item.profit, netprofit: item.netprofit
            }
            seasonlist[no] = sItem;

            let yearmonth = GFunc.GetSeasonnoYearMonth(no);
            if (yearmonth.month === 12) {
                let ci = { year: yearmonth.year, capital: item.capital, earning: item.netprofit / item.shares };
                this._capitalearning.push(ci);
            }
        }

        let i = 0;
        for (let seasonno = minNo; seasonno <= maxNo; ++seasonno, ++i) {
            let si = seasonlist[seasonno];
            if (si === undefined) {
                continue;
            }
            this.seasonData.splice(0, 0, si);
        }

        let noBegin = maxNo - 19;
        this.predictData = undefined;
        this.predictSeasonData.splice(0);
        this.predictSeasonDataFull.splice(0);
        if (noBegin < minNo) return;
        noBegin += 3;
        this.ypredict = [];
        for (let x = noBegin; x <= maxNo; x += 4) {
            let item = seasonlist[x];
            if (item === undefined) break;
            this.predictSeasonData.splice(0, 0, item);
            this.ypredict.push(item.netprofit / lastShares);
        }

        for (let x = maxNo; x >= minNo; x -= 4) {
            let item = seasonlist[x];
            if (item === undefined) break;
            this.predictSeasonDataFull.push(item);
        }

        if (this.ypredict.length === 5) {
            let er = new ErForEarning(this.ypredict);
            let lr = new SlrForEarning(this.ypredict);
            this.predictData = { e: this.ypredict[4], b: er.B, r2: er.r2, epre: er.predict(4), l: lr.slopeR, lr2: lr.r2, lpre: lr.predict(4) };
        }
        else {
            this.predictSeasonData.splice(0);
        }
    }

    protected LoadBonusData() {
        this.predictBonusData.splice(0);
        if (this._sharesArr === undefined || this._sharesArr.length <= 0) return;
        let dt = new Date();
        let maxNo = GFunc.SeasonnoFromYearMonth(dt.getFullYear(), dt.getMonth() - 1) - 2;
        let minNo = -1;
        let dataOrg: { [index: number]: { bonus: number, shares: number } } = {};
        let seasonData: { [index: number]: { bonus: number, shares: number, bs: number } } = {};
        for (let item of this._bonus) {
            let { day, bonus, shares } = item as { day: number, bonus: number, shares: number };
            if (shares <= 0 || bonus <= 0) continue;
            if (day < 19950101) continue;
            let sno = GFunc.SeasonnoFromDayForBonus(day);
            dataOrg[sno] = { bonus: bonus, shares: shares };
            if (minNo < 0) {
                minNo = sno;
            }
            else {
                if (sno < minNo)
                    minNo = sno;
            }
            if (sno > maxNo) {
                maxNo = sno;
            }
        }

        let getBonusPrev3 = (sno: number) => {
            let r = 0;
            for (let n = sno - 3; n < sno; ++n) {
                let item = dataOrg[n];
                if (item === undefined) continue;
                r += item.bonus * item.shares;
            }
            return r;
        }


        for (let no = minNo; no <= maxNo; ++no) {
            let item = dataOrg[no];
            let bsum = 0;
            if (item === undefined) {
                let { end } = GFunc.SeasonnoToBeginEnd(no);
                item = { bonus: 0, shares: this.getTotalShares(end) };
            }
            else {
                bsum = item.bonus * item.shares;
            }

            bsum += getBonusPrev3(no);
            bsum = bsum / item.shares;
            seasonData[no] = { bonus: bsum, bs: item.bonus, shares: item.shares };
        }

        let lastItem = seasonData[maxNo];
        if (lastItem === undefined) {
            return;
        }

        let lastShares = lastItem.shares;
        if (lastShares === undefined || lastShares <= 0) {
            return;
        }

        for (let i = maxNo; i >= maxNo - 16; i -= 4) {
            let ni = seasonData[i];
            if (ni === undefined) break;
            let b = 0;
            if (ni.bonus > 0 && ni.shares > 0) {
                b = ni.bonus * ni.shares / lastShares;
            }
            let ym = GFunc.GetSeasonnoYearMonth(i);
            this.predictBonusData.unshift({ year: ym.year, bonus: b });
        }
    }

    async internalStart(param: any) {
        this.baseItem = param as NStockInfo;
        this.stock = param.stock;
        let { id } = this.baseItem;
        //this.isMySelect = this.cApp.store.isMyAll(this.stock);
        this.initLoad();
        this.openVPage(VStockInfo);
    }

    openMetaView = () => {
    }

}
