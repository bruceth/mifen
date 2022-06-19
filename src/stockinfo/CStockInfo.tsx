/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, makeObservable } from 'mobx';
import { CUqBase } from "../uq-app";
import { GFunc } from './GFunc';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockCapitalearning, StockBonus, StockDividentInfo } from './StockInfoType';
import { Stock, StockValue } from 'uq-app/uqs/BruceYuMi';
import { ErForEarning } from './ErForEarning';
import { SlrForEarning } from './SlrForEarning';
import { MiNet } from '../net';
import { VBonusDetail } from './VBonusDetail';
import { VProfilDetail } from './VProfitDetail';

export class CStockInfo extends CUqBase {
    stock: Stock & StockValue;
    @observable baseItem: NStockInfo;
    @observable protected loaded: boolean = false;

    @observable price: StockPrice;

    @observable seasonData: { season: number, c: number, corg: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictSeasonData: { season: number, c: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictSeasonDataFull: { season: number, c: number, shares: number, revenue: number, profit: number, netprofit: number }[] = [];
    @observable predictData: { e: number, b: number, r2: number, epre: number, l: number, lr2: number, lpre: number };
    @observable predictBonusData: { year: number, bonus: number }[] = [];
    @observable ypredict: number[] = [];

    @observable mirates: { day: number, mirate: number, price: number }[] = [];
    @observable mivalues: { season: number, mivalue: number }[] = [];

    protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true });
    protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true });
    protected _divideInfo: IObservableArray<StockDividentInfo> = observable.array<StockDividentInfo>([], { deep: true });
    protected _sharesArr: { day: number, shares: number }[] = [];
    protected _divident: IObservableArray<{ year: number, season: string, divident: number, day: number }> = observable.array<{ year: number, season: string, divident: number, day: number }>([], { deep: true });

    @computed get capitalearning(): IObservableArray<StockCapitalearning> {
        if (this.loaded === false) return undefined;
        return this._capitalearning;
    }

    @computed get bonus(): IObservableArray<StockBonus> {
        if (this.loaded === false) return undefined;
        return this._bonus;
    }

    @computed get divideInfo(): IObservableArray<StockDividentInfo> {
        if (this.loaded === false) return undefined;

        return this._divideInfo;
    }

    @computed get dividentOrg() {
        if (this.loaded === false) return undefined;

        return this._divident;
    }

    @computed get dividents() {
        if (this.loaded === false) return undefined;
        if (this._divident.length <= 0) return undefined;
        let { day, trackDay } = this.baseItem;
        let lday = trackDay;
        let lastYear: number;
        if (lday === undefined) {
            lday = day;
        }
        let y = Math.floor(lday / 10000);
        let m = Math.floor((lday % 10000) / 100);
        lastYear = y - 1;
        if (m < 4) {
            lastYear--;
        }
        let lshares: number = this.getLastTotalShares();
        let yearDataA: { [index: number]: { bonus: number } } = {};
        let retArr: { year: number, divident: number, d3?: number }[] = [];
        let minYear = undefined;
        let maxYear = 0;
        for (let item of this._divident) {
            let { year, divident, day, season } = item;
            if (minYear === undefined) {
                minYear = year;
            }
            else if (year < minYear) {
                minYear = year;
            }
            if (year > maxYear) {
                maxYear = year;
            }
            var shares: number = undefined;
            if (day === undefined) {
                shares = lshares;
            }
            else {
                shares = this.getTotalShares(day);
            }
            if (shares <= 0 || shares === undefined || shares === null || divident <= 0) continue;
            let yb = yearDataA[year];
            if (yb === undefined) {
                yearDataA[year] = { bonus: divident * shares };
            }
            else {
                yearDataA[year] = { bonus: yb.bonus + divident * shares }
            }
        }
        if (maxYear > lastYear && trackDay === undefined) {
            lastYear = maxYear;
        }

        let getLast3YearData = (checkYear: number) => {
            let sum: number = 0;
            for (let i = checkYear; i > checkYear - 3; --i) {
                let item = yearDataA[i];
                if (item !== undefined) {
                    sum += item.bonus;
                }
            }
            return sum !== 0 ? sum / 3 : undefined;
        }

        for (let yi = minYear; yi <= lastYear; yi++) {
            let item = yearDataA[yi];
            let bonus = item !== undefined ? item.bonus / lshares : undefined;
            let d3 = undefined;
            if (yi >= minYear + 2) {
                d3 = getLast3YearData(yi);
                if (d3 !== undefined) {
                    d3 = d3 / lshares;
                }
            }
            retArr.push({ year: yi, divident: bonus, d3 });
        }

        return retArr;
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

        let { rawId, day, trackDay } = this.baseItem;
        let rets;
        if (trackDay !== undefined) {
            rets = await Promise.all([
                this.miNet.q_stockallinfotrack(rawId, trackDay)
            ]);
        }
        else {
            rets = await Promise.all([
                this.miNet.q_stockallinfo(rawId, day)
            ]);
        }
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

            this.mivalues.splice(0);
            let mvArr = ret[7] as { season: number, mivalue: number, volume: number }[];
            let mvr: { season: number, mivalue: number }[] = [];
            if (mvArr.length > 0) {
                let vlast = mvArr[0].volume;
                if (vlast !== undefined) {
                    mvArr.forEach(v => {
                        let { season, mivalue, volume } = v;
                        if (mivalue !== undefined && volume !== null) {
                            let miv = mivalue * volume / vlast;
                            mvr.unshift({ season: season, mivalue: miv });
                        }
                    })
                    this.mivalues.push(...mvr);
                }
            }

            let mlen = mvr.length;
            let getMivalue = (day: number) => {
                let season = GFunc.SeasonnoFromDay(day) - 1;
                for (let i = 0; i < mlen; i++) {
                    let mi = mvr[i];
                    if (mi.season == season) {
                        return mi.mivalue;
                    }
                    else if (mi.season > season) {
                        break;
                    }
                }
                return undefined;
            }

            let ratesArr = ret[6] as { day: number, mirate: number }[];
            let rates: { day: number, mirate: number, price: number }[] = []
            ratesArr.forEach(v => {
                let { day, mirate } = v;
                let mv = getMivalue(day);
                let price: number = undefined;
                if (mv !== undefined && mirate !== null && mirate !== undefined) {
                    price = mv * 100 / mirate;
                }

                rates.unshift({ day: day, mirate: mirate, price: price });
            });
            this.mirates.splice(0);
            this.mirates.push(...rates);

            this.loadTTMEarning(ret[2]);
            this.LoadDivident(ret[8]);
            this.LoadBonusData();
        }

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

    protected getLastTotalShares(): number {
        let ret: number = undefined;
        if (this._sharesArr.length > 0) {
            let item = this._sharesArr[0];
            ret = item.shares;
        }

        return ret;
    }

    protected loadTTMEarning(list: { seasonno: number, capital: number, revenue: number, profit: number, netprofit: number, shares: number }[]) {
        this.seasonData.splice(0);
        let seasonlist: { [index: number]: { season: number, c: number, corg: number, shares: number, revenue: number, profit: number, netprofit: number } } = {};
        let len = list.length;
        if (len <= 0) return;
        let minNo = list[len - 1].seasonno;
        let lastItem = list[0];
        let lastShares = lastItem.shares;
        let maxNo = lastItem.seasonno;

        let _ce = [];
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
                _ce.push(ci);
            }
        }
        this._capitalearning.push(..._ce);

        let i = 0;
        let sd = [];
        for (let seasonno = minNo; seasonno <= maxNo; ++seasonno, ++i) {
            let si = seasonlist[seasonno];
            if (si === undefined) {
                continue;
            }
            sd.unshift(si);
        }
        this.seasonData.push(...sd);

        let noBegin = maxNo - 19;
        this.predictData = undefined;
        this.predictSeasonData.splice(0);
        this.predictSeasonDataFull.splice(0);
        if (noBegin < minNo) return;
        noBegin += 3;
        this.ypredict.splice(0);
        let ypt = [];
        for (let x = noBegin; x <= maxNo; x += 4) {
            let item = seasonlist[x];
            if (item === undefined) break;
            this.predictSeasonData.splice(0, 0, item);
            ypt.push(item.netprofit / lastShares);
        }
        this.ypredict.push(...ypt);

        let psdf = [];
        for (let x = maxNo; x >= minNo; x -= 4) {
            let item = seasonlist[x];
            if (item === undefined) break;
            psdf.push(item);
        }
        this.predictSeasonDataFull.push(...psdf);

        if (this.ypredict.length === 5) {
            let er = new ErForEarning(this.ypredict);
            let lr = new SlrForEarning(this.ypredict);
            this.predictData = { e: this.ypredict[4], b: er.B, r2: er.r2, epre: er.predict(4), l: lr.slopeR, lr2: lr.r2, lpre: lr.predict(4) };
        }
        else {
            this.predictSeasonData.splice(0);
        }
    }

    protected LoadDivident(list: { year: number, season: string, divident: number, dday: number }[]) {
        this._divident.clear();
        let darr = [];
        for (let item of list) {
            let { year, season, divident, dday } = item;
            darr.push({ year, season, divident, day: dday });
        }
        this._divident.push(...darr);
    }

    protected LoadBonusData() {
        this.predictBonusData.splice(0);
        if (this._sharesArr === undefined || this._sharesArr.length <= 0) return;
        let maxNo: number;
        let trackDay = this.baseItem.trackDay;
        if (trackDay === undefined) {
            let dt = new Date();
            maxNo = GFunc.SeasonnoFromYearMonth(dt.getFullYear(), dt.getMonth() + 1) - 2;
        }
        else {
            let y =
                maxNo = GFunc.SeasonnoFromYearMonth(Math.floor(trackDay / 10000), Math.floor((trackDay % 10000) / 100));
        }
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

        let pbd: { year: number, bonus: number }[] = [];
        for (let i = maxNo; i >= maxNo - 16; i -= 4) {
            let ni = seasonData[i];
            if (ni === undefined) break;
            let b = 0;
            if (ni.bonus > 0 && ni.shares > 0) {
                b = ni.bonus * ni.shares / lastShares;
            }
            let ym = GFunc.GetSeasonnoYearMonth(i);
            pbd.unshift({ year: ym.year, bonus: b });
        }
        this.predictBonusData.push(...pbd);
    }

    async internalStart(param: any) {
        this.baseItem = param as NStockInfo;
        this.stock = param.stock;
        this.initLoad();
        this.openVPage(VStockInfo);
    }

    openMetaView = () => {
    }

    showBonus = () => {
        this.openVPage(VBonusDetail);
    }

    showProfit = () => {
        this.openVPage(VProfilDetail)
    }
}
