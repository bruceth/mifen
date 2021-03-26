import { action, IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { Account, AccountValue, Holding, Portfolio, StockValue } from "uq-app/uqs/BruceYuMi";
import { HoldingStock } from "./holdingStock";
import { Store } from "./store";

export class MiAccount  implements Account, AccountValue {
	protected store: Store;
	id: number;
	no: string;
	name: string;
	count: number = 0;
	mi: number = 0;
	market: number = 0;
	divident: number = 0;
	cash: number = null;

	holdingStocks: IObservableArray<HoldingStock> = null;

	constructor(store: Store, account: Account&AccountValue) {
		makeObservable(this, {
			holdingStocks: observable,
			count: observable,
			mi: observable,
			market: observable,
			divident: observable,
			cash: observable,
			loadItems: action,
			buyNewHolding: action,
			buyHolding: action,
			sellHolding: action,
		})
		this.store = store;
		Object.assign(this, account);
		this.cash = undefined;
	}

	async loadItems() {
		let sorter = (a:HoldingStock, b:HoldingStock) => {
			let aMiRate = a.mi/a.market;
			let bMiRate = b.mi/b.market;
			if (aMiRate < bMiRate) return 1;
			if (aMiRate > bMiRate) return -1;
			return 0;
		}
		if (this.holdingStocks) {
			this.holdingStocks.sort(sorter);
			return;
		}
		let {yumi} = this.store;
		let ret = await yumi.IX<Holding&Portfolio>({
			IX: yumi.AccountHolding,
			ix: this.id,
			IDX: [yumi.Holding, yumi.Portfolio]
		});
		let noneStocks = ret.filter(v => !this.store.stockFromId(v.stock));
		if (noneStocks.length > 0) {
			await yumi.ActIX({
				IX: yumi.UserAllStock,
				values: noneStocks.map(v => ({ix:undefined, id: v.stock}))
			});
			await this.store.loadMyAll();
		}
		runInAction(() => {
			let list = ret.map(v => {
				let {id, stock:stockId} = v;
				let stock = this.store.stockFromId(stockId);
				let holdingStock = new HoldingStock(id, stock, v.quantity);
				return holdingStock;
			});
			list.sort(sorter);
			this.holdingStocks = observable(list);
			this.count = this.holdingStocks.length;	
		});
	}

	async buyNewHolding(stockId: number, price: number, quantity: number) {
		let holdingId: number;
		let stock = this.store.stockFromId(stockId);
		if (!stock) {
			stock = await this.store.loadStock(stockId);
			if (!stock) throw new Error(`stock ${stockId} not exists`);
		}
		let index = this.holdingStocks.findIndex(v => v.stock === stockId);
		if (index < 0) {
			holdingId = await this.saveHolding(stockId);
			await this.store.addMyAll(stock);
			let hs = new HoldingStock(holdingId, stock, quantity);
			hs.setQuantity(price, quantity);
			this.holdingStocks.push(hs);
		}
		else {
			let orgHs = this.holdingStocks[index];
			holdingId = orgHs.id;
			let holdingQuantity = orgHs.quantity + quantity;
			orgHs.setQuantity(price, holdingQuantity);
		}
		await this.bookHolding(holdingId, price, quantity);
	}

	async buyHolding(stockId: number, price: number, quantity: number) {
		let index = this.holdingStocks.findIndex(v => v.stock === stockId);
		if (index < 0) return;
		let orgHs = this.holdingStocks[index];
		let holdingId = orgHs.id;
		let holdingQuantity = orgHs.quantity + quantity;
		orgHs.setQuantity(price, holdingQuantity);
		await this.bookHolding(holdingId, price, quantity);
	}

	private async saveHolding(stock:number): Promise<number> {
		let ret = await this.store.yumi.Acts({
			holding: [{account: this.id, stock, order: undefined}]
		});
		return ret.holding[0];
	}

	private async bookHolding(holdingId:number, price:number, quantity:number): Promise<void> {
		this.recalc();
		await this.store.yumi.Acts({
			accountValue: [{
				id: this.id,
				mi: this.mi,
				market: this.market,
				count: this.count,
			}],
			accountHolding: [{
				ix: this.id,
				id: holdingId
			}],
			portfolio: [{
				id: holdingId,
				quantity: quantity,
			}],
			transaction: [{
				holding: holdingId,
				tick: undefined,
				price, 
				quantity,
				amount: price * quantity,
			}],
		});
	}

	async sellHolding(stockId: number, price: number, quantity: number) {
		let holding = this.holdingStocks.find(v => v.stock === stockId);
		if (holding === undefined) return;
		holding.setQuantity(price, holding.quantity - quantity);
		await this.bookHolding(holding.id, price, -quantity);
	}

	private recalc() {
		this.count = this.holdingStocks.length;
		let sumMi = 0, sumMarket = 0, sumDivident = 0;
		for (let sh of this.holdingStocks) {
			let {mi, market, divident} = sh;
			sumMi += mi;
			sumMarket += market;
			sumDivident += divident;
		}
		this.mi = sumMi;
		this.market = sumMarket;
		this.divident = sumDivident;
	}

	private async cashAct(amount: number, act: string):Promise<void> {
		await this.store.yumi.Acts({
			accountValue: [{id: this.id, cash: amount}]
		});
	}

	async cashInit(amount: number) {
		await this.cashAct(amount, 'init');
		runInAction(() => {
			if (typeof this.cash !== 'number') this.cash = amount;
		});
	}

	async cashIn(amount: number) {
		await this.cashAct(amount, 'in');
		runInAction(() => {
			if (!this.cash) this.cash = amount;
			else this.cash += amount;
		});
	}

	async cashOut(amount: number) {
		await this.cashAct(-amount, 'out');
		runInAction(() => {
			this.cash -= amount;
		});
	}

	async cashAdjust(amount: number) {
		await this.cashAct(amount, 'adjust');
		runInAction(() => {
			if (!this.cash) this.cash = amount;
			else this.cash += amount;
		});
	}
}
