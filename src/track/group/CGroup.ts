import { action, computed, IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { MiAccount, MGroup, HoldingStock } from "../../store";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqSub, UQs } from "../../uq-app";
import { CTrack } from "../CTrack";
import { VGroups } from "./VGroups";
import { VStockList } from "./VStockList";
import { VRootIndustry } from "./VRootIndustry";

export class CGroup extends CUqSub<CApp, UQs, CTrack> {
	miGroup: MGroup = null;
	miAccount: MiAccount = null;
	holdingStock: HoldingStock;
	stocks: IObservableArray<Stock & StockValue>;

	constructor(cTrack: CTrack) {
		super(cTrack);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
			stocks: observable,
			listCaption: computed,
			showMiGroup: action,
			showStocksAll: action,
		});
	}

	async internalStart(param: any) {
	}

	private _listCaption: string;
	get listCaption(): string {
		return this._listCaption?? this.miGroup?.name;
	}

	renderGroups() {
		let {miGroups} = this.cApp.store;
		let {groups } = miGroups;
		return this.renderView(VGroups, groups);
	}

	renderIndustries() {
		let {industries} = this.cApp.store;
		let {groups} = industries;
		return this.renderView(VGroups, groups);
	}

	// renderRootIndustries() {
	// 	let {rootIndustries} = this.cApp.store;
	// 	let {groups} = rootIndustries;
	// 	return this.renderView(VRootIndustry, groups);
	// }

	showMiGroup = async (miGroup: MGroup) => {
		this._listCaption = undefined;
		this.miGroup = miGroup;

		let renderPageRight: () => JSX.Element;
		if (this.miGroup.type === 'group') {
			renderPageRight = () => {
				let cID = this.cApp.cCommon.buildCIDUserGroup();
				return cID.renderViewRight(this.miGroup);
			}
		}

		this.openStocksList(undefined, renderPageRight);
		await this.miGroup.loadItems();
        let stocks = await this.loadItemsValue(this.miGroup.stocks);
		this.setStocksList(stocks);
	}

    protected loadItemsValue = async(stocks:IObservableArray<Stock & StockValue>) => {
        let ids: number[] = [];
        let items: (Stock & StockValue)[]= [];
        stocks.forEach(si => {
            ids.push(si.rawId)
            items.push({...si});
        });

        if (ids.length > 0) {
            let newValues = await this.cApp.store.minet.q_stocksvalue(this.owner.trackDay, ids) as any[];
            let n = 0;
            items.forEach(si => {
                let rawId = si.rawId;
                let fi = newValues.findIndex((item)=> { return item.id === rawId});
                if (fi >= 0) {
                    let vi = newValues[fi];
                    si.earning = vi.earning;
                    si.divident = vi.divident;
                    si.price = vi.price;
                    si.roe = vi.roe;
                    si.volumn = vi.volumn;
                    si.dvRate = vi.dvrate;
                    si.ttm = vi.ttm;
                    si.miRate = vi.mirate;
                    si.miValue = vi.mivalue;
                    si.incValue = vi.incvalue;
                    si.inc1 = vi.inc1;
                    si.inc2 = vi.inc2;
                    si.inc3 = vi.inc3;
                    si.inc4 = vi.inc4;
                    si.preInc = vi.preinc;
                    si.smoothness = vi.smoothness;
                }
                else {
                    si.earning = undefined;
                    si.divident = undefined;
                    si.price = undefined;
                    si.roe = undefined;
                    si.volumn = undefined;
                    si.dvRate = undefined;
                    si.ttm = undefined;
                    si.miRate = undefined;
                    si.miValue = undefined;
                    si.incValue = undefined;
                    si.inc1 = undefined;
                    si.inc2 = undefined;
                    si.inc3 = undefined;
                    si.inc4 = undefined;
                    si.preInc = undefined;
                    si.smoothness = undefined;
                }
            })
        }
        return observable(items);
    }

	showRootIndustry = async (miGroup: MGroup) => {
		let cGroup = this.owner.newSub(CGroup);
		await cGroup.showMiGroup(miGroup); //.start();
		/*
		this._listCaption = undefined;
		this.openStocksList(undefined);
		await miGroup.loadItems();
		this.setStocksList(miGroup.stocks);
		*/
	}

	showStocksAll = async () => {
		let {store} = this.cApp;
		this._listCaption = store.myAllCaption;
		this.miGroup = undefined;
		this.openStocksList();
        let stocks = await this.loadItemsValue(store.stocksMyAll);
		this.setStocksList(stocks);
	}

	showStocksBlock = async () => {
		let {store} = this.cApp;
		let renderRowRight = this.cApp.cCommon.renderBlockStock;
		this._listCaption = store.myBlockCaption;
		this.miGroup = undefined;
		this.openStocksList(renderRowRight);
		await this.cApp.store.loadMyBlock();
		//this.setStocksList(store.stocksMyBlock);
        let stocks = await this.loadItemsValue(store.stocksMyBlock);
		this.setStocksList(stocks);
	}

	private openStocksList(renderRowRight?: (stock:Stock & StockValue) => JSX.Element, 
		renderPageRight?: () => JSX.Element) {
		runInAction(() => {
			//this.listCaption = caption;
			this.stocks = undefined;
			this.openVPage(VStockList, {renderRowRight, renderPageRight});
		});
	}

	private setStocksList(stocks: IObservableArray<Stock&StockValue>) {
		runInAction(() => {
			this.stocks = stocks.sort((a, b) => {
				let am = a.miRate;
				let bm = b.miRate;
                if (am === undefined) {
                    if (bm === undefined) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                }
                else if (bm === undefined) {
                    return -1;
                }
				if (am < bm) return 1;
				if (am > bm) return -1;
				return 0;
			});
			let len = this.stocks.length;
			for (let i=0; i<len; i++) (this.stocks[i] as any).$order = i+1;
		})
	}

	onStockClick = async (stock: Stock & StockValue) => {
		//this.cApp.cCommon.showStock(stock);
        let trackDay = this.owner.trackDay;
        this.cApp.openStock(stock, trackDay);
	}
}
