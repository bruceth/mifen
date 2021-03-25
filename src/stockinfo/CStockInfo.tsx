/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, makeObservable } from 'mobx';
import { nav } from 'tonva-react';
import { CUqBase } from "../uq-app";
import { GFunc } from '../tool/GFunc';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockCapitalearning, StockBonus, StockDivideInfo } from './StockInfoType';
import { VTags, VNewTag, VEditTag } from './VTags';
import { ErForEarning, SlrForEarning } from 'regression';
import { StockGroup } from '../store';
import { Stock, StockValue } from 'uq-app/uqs/BruceYuMi';

export class CStockInfo extends CUqBase {
	stock: Stock & StockValue;
    @observable baseItem: NStockInfo;
    @observable protected loaded: boolean = false;

    @observable price: StockPrice;
    //@observable roe: StockRoe;
    //@observable tags: any[] = undefined;
    @observable stockTags: any[];
    selectedTags: any[];

    protected exrightForEarning: { day: number, factor: number }[] = [];
    protected exrightInfo: { day: number, bonus: number, factor: number, factore: number }[] = [];
    @observable seasonData: { season: number, c: number, e: number, esum: number, corg: number, eorg: number, esumorg: number }[] = [];
    @observable predictSeasonData: { season: number, c: number, e: number, esum: number, corg: number, eorg: number, esumorg: number }[] = [];
    @observable predictSeasonDataFull: { season: number, c: number, e: number, esum: number, corg: number, eorg: number, esumorg: number }[] = [];
    @observable predictData: { e: number, b: number, r2: number, epre: number, l: number, lr2: number, lpre: number };
    @observable ypredict: number[] = [];
    // @observable historyData:{day:number, price:number, ttm:number}[] =  [];
    // protected historyDataOrg:{day:number, price:number, dayno:number}[] = [];

    //protected _earning: IObservableArray<StockEarning> = observable.array<StockEarning>([], { deep: true });
    protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true });
    protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true });
    protected _divideInfo: IObservableArray<StockDivideInfo> = observable.array<StockDivideInfo>([], { deep: true });

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

    //@observable isMySelect: boolean = false;

    constructor(cApp: any) {
        super(cApp);
        makeObservable(this);
    }
    initLoad = () => {
        this.load();
    }

    private load = async () => {
        if (!this.baseItem) return;

        let { id, day,  } = this.baseItem;
        let rets = await Promise.all([
            this.cApp.miNet.q_stockallinfo(id, day),
            this.cApp.miNet.t_tagstock$query(undefined, id),
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
                let barr = arr3.filter((v: any) =>　{
                    return v.派息 as number > 0;
                }).map((v: any) => {
                    return {day:v.day, bonus:v.派息};
                })
                this._bonus.push(...barr);
            }

            await this.loadTTMEarning(ret[2]);
        }

        //this.isMySelect = this.cApp.store.isMyAll(this.stock);
        this.loaded = true;
    }

    protected async loadTTMEarning(list: { seasonno: number, capital: number, earning: number, es: number, shares: number }[]) {
        this.seasonData.splice(0);
        let seasonlist: { [index: number]: { season: number, c: number, e: number, esum: number, corg: number, eorg: number, esumorg: number } } = {};
        let len = list.length;
        if (len <= 0) return;
        let minNo = list[len - 1].seasonno;
        let lastItem = list[0];
        let lastShares = lastItem.shares;
        let maxNo = lastItem.seasonno;

        for (let item of list) {
            let no = item.seasonno;
            let sItem = {
                season: no, c: item.capital * item.shares / lastShares, e: item.es * item.shares / lastShares, esum: item.earning * item.shares / lastShares,
                corg: item.capital, eorg: item.es, esumorg: item.earning
            }
            seasonlist[no] = sItem;

            let yearmonth = GFunc.GetSeasonnoYearMonth(no);
            if (yearmonth.month === 12) {
                let ci = {year: yearmonth.year, capital: item.capital, earning: item.earning };
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
            this.ypredict.push(item.esum);
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

    protected ExrightEarning(endDay: number, season: number, item: { c: number, e: number, esum: number }) {
        let { end } = GFunc.SeasonnoToBeginEnd(season);
        for (let i = 0; i < this.exrightForEarning.length; ++i) {
            let exitem = this.exrightForEarning[i];
            let day = exitem.day;
            if (day > endDay) break;
            if (day < end) continue;
            let factor = exitem.factor;
            item.c = item.c * factor;
            item.e = item.e * factor;
            item.esum = item.esum * factor;
        }
    }

    // loadHistoryData(showAll: boolean) {
    //     let list = this.historyDataOrg;
    //     let length = list.length;
    //     if (length <= 10) {
    //         this.historyData = [];
    //         return;
    //     }

    //     if (!showAll) {
    //         let day = this.baseItem.day;
    //         if (day !== undefined) {
    //             let i = length - 1;
    //             for (; i >= 0; --i) {
    //                 let item = list[i];
    //                 if (item.day <= day) break;
    //             }
    //             length = i + 1;
    //         }
    //     }
    //     let endIndex = length - 1;
    //     let lastItem = list[endIndex];
    //     let lastdayno = lastItem.dayno;
    //     if (lastdayno === undefined) {
    //         while (endIndex > 0) {
    //             --endIndex;
    //             lastItem = list[endIndex];
    //             lastdayno = lastItem.dayno;
    //             if (lastdayno !== undefined) break;
    //         }
    //     }
    //     let lastDay = lastItem.day;
    //     let not = lastdayno % 5;
    //     let historyList: any[] = [];
    //     for (let i = 0; i <= endIndex; ++i) {
    //         let { day, price, dayno } = list[i];
    //         if (dayno % 5 === not) {
    //             historyList.push({ day: day, price: this.RestorePrice(price, day, lastDay), ttm: this.CalculateHistoryPE(price, day) });
    //         }
    //     }
    //     this.historyData = historyList;
    // }

    RestorePrice(price: number, dayFrom: number, dayIndex: number) {
        let bsum = 0;
        let pricere = price;
        if (dayFrom < dayIndex) {
            for (let i = 0; i < this.exrightInfo.length; ++i) {
                let { day, bonus, factor, factore } = this.exrightInfo[i];
                if (day <= dayFrom)
                    continue;
                if (day > dayIndex)
                    break;
                pricere = pricere * factor;
                bsum = (bsum + bonus) * factore;
            }
            pricere = pricere - bsum;
        }
        else {
            for (let i = 0; i < this.exrightInfo.length; ++i) {
                let { day, bonus, factor, factore } = this.exrightInfo[i];
                if (day <= dayIndex)
                    continue;
                if (day > dayFrom)
                    break;
                pricere = pricere / factor;
                bsum = bsum / factore + bonus;
            }
            pricere = pricere + bsum;
        }
        return pricere;
    }

    CalculateHistoryPE(price: number, day: number) {
        let season = GFunc.SeasonnoFromDay(day);
        let len = this.seasonData.length;
        for (let i = 0; i < len; ++i) {
            let item = this.seasonData[i];
            if (item.season >= season) continue;
            if (item.esumorg === undefined) return undefined;
            let { end } = GFunc.SeasonnoToBeginEnd(item.season);
            let pricere = this.RestorePrice(price, day, end);
            return pricere / item.esumorg;
        }

        return undefined;
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

    onSelectTag = async () => {
        //await this.loadTags();
        this.selectedTags = this.cApp.store.stockGroups.getSelected(this.stockTags);
        /*
        this.cApp.store.stockGroups.filter(v => {
            let i = this.stockTags.findIndex(st => st.tag === v.groupId);
            return i >= 0;
        });
        */
        //await this.loadTags();
        this.openVPage(VTags);
    }

    onNewTag = () => {
        this.openVPage(VNewTag);
    }

    onEditTag = (param: any) => {
        this.openVPage(VEditTag, param);
    }

    onSaveNewTag = async (data: any) => {
        let { name } = data;
        //let param = { id: undefined, name: name };
        //let ret = await this.cApp.store.miApi.call('t_tag$save', [this.user.id, undefined, name]);
        let ret = await this.cApp.miNet.t_tag$save(name);
        let { retId } = ret;
        if (retId < 0) {
            alert(name + ' 已经被使用了');
            return false;
        }
        this.cApp.store.stockGroups.add(
            new StockGroup(name, name, this.cApp.miNet)
        );
        return true;
    }

    onSaveTag = async (data: any) => {
        let { id, name } = data;
        let { stockGroups } = this.cApp.store;
        let param = { id: id, name: name };
        let exists = stockGroups.exists(id, name);
        if (exists === true) {
            alert(name + ' 已经被使用了');
            return false;
        }
        let ret = await this.cApp.miNet.t_tag$save(name);
        let { retId } = ret;
        if (retId === undefined || retId < 0) {
            alert(name + ' 已经被使用了');
            return false;
        }
        let group = stockGroups.groupFromId(id);
        if (group) {
            group.name = name;
        }
        return true;
    }

    onClickSelectTag = async (tag: any, isSelected: boolean) => {
        let param = {
            user: nav.user.id,
            tag: tag.id,
            arr1: [
                { stock: this.baseItem.id }
            ]
        };
        if (isSelected === true) {
            //let ret = await this.cApp.store.miApi.call('t_tagstock$add', [this.user.id, tag.id, this.baseItem.id]); //.uqs.mi.TagStock.add(param);
            await this.cApp.store.addTagStock(this.baseItem as any);
            //let ret = this.cApp.miNet.t_tagstock$add(tag.id, this.baseItem.id);
            let newTag = {
                tag: {
                    id: tag.id,
                }
            }
            this.stockTags.push(newTag);
        }
        else {
            //let ret = await this.cApp.store.miApi.call('t_tagstock$del', [this.user.id, tag.id, this.baseItem.id]); // //await this.uqs.mi.TagStock.del(param);
            //let ret = this.cApp.miNet.t_tagstock$del(tag.id, this.baseItem.id);
            await this.cApp.store.removeTagStock(this.baseItem as any);
            let i = this.stockTags.findIndex(v => v.tag.id === tag.id);
            this.stockTags.splice(i, 1);
        }
    }

    onClickDefaultTag = async (isSelected: boolean) => {
        //let tagid = this.cApp.store.defaultListTagID;
        let { store } = this.cApp;
        let { id: groupId } = store.stockGroups.defaultGroup;
        if (isSelected === true) {
            //let ret = this.cApp.miNet.t_tagstock$add(tagid, this.baseItem.id);
            await store.addTagStock(this.baseItem as any);
            let newTag = {
                tag: {
                    id: store.stockGroups.defaultGroup.id,
                }
            }
            this.stockTags.push(newTag);
        }
        else {
            //let ret = await this.cApp.store.miApi.call('t_tagstock$del', [this.user.id, tagid, this.baseItem.id]); // //await this.uqs.mi.TagStock.del(param);
            await this.cApp.store.removeTagStock(this.baseItem as any);
            //let ret = this.cApp.miNet.t_tagstock$del(tagid, this.baseItem.id);
            let i = this.stockTags.findIndex(v => v.tag.id === groupId);
            this.stockTags.splice(i, 1);
        }
    }
}
