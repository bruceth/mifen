import { action, autorun, IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { Account, AccountValue, Holding, Portfolio } from "uq-app/uqs/BruceYuMi";
import { HoldingStock } from "./holdingStock";
import { holdingMiRateSorter } from "./sorter";
import { Store } from "./store";

export class MiAccount  implements Account, AccountValue {
	protected store: Store;
	id: number;
	no: string;
	name: string;
	portion: number = 20;
	portionAmount: number = null;
	count: number = 0; 
	buyableCount: number = 0;
	miValue: number = 0;
	market: number = 0;
	divident: number = 0;
	cash: number = null;

	holdingStocks: IObservableArray<HoldingStock> = null;

	constructor(store: Store, account: Account&AccountValue) {
		makeObservable(this, {
			name: observable,
			portion: observable,
			portionAmount: observable,
			holdingStocks: observable,
			count: observable,
			miValue: observable,
			market: observable,
			divident: observable,
			cash: observable,
			loadItems: action,
			buyNewHolding: action,
			buyHolding: action,
			sellHolding: action,
			buyableCount: observable,
		})
		this.store = store;
		Object.assign(this, account);
		autorun(this.setPortionAmount);
	}

	async loadItems() {
		if (this.holdingStocks) {
			this.holdingStocks.sort(holdingMiRateSorter);
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
				values: noneStocks.map(v => ({ix:undefined, xi: v.stock}))
			});
			await this.store.loadMyAll();
		}
		runInAction(() => {
			let list = ret.map(v => {
				let {id, stock:stockId, cost, everBought} = v;
				let stock = this.store.stockFromId(stockId);
				let holdingStock = new HoldingStock(id, stock, v.quantity, cost);
				holdingStock.everBought = everBought;
				return holdingStock;
			});
			list.sort(holdingMiRateSorter);
			this.holdingStocks = observable(list);
			this.count = this.holdingStocks.length;	
			this.recalc();
			this.setPortionAmount();
		});
	}

	private setPortionAmount = () => {
		let v = (this.market + (this.cash??0));
		let p = v / this.portion;
		p = Math.round(p / 1000) * 1000;
		if (p > 0) {
			this.portionAmount = p;
			return;
		}
		this.portion = 5;
		p = v / this.portion;
		p = Math.round(p / 1000) * 1000;
		if (p > 0) {
			this.portionAmount = p;
			return;
		}
		this.portion = 1;
		this.portionAmount = undefined;
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
			let hs = new HoldingStock(holdingId, stock, quantity, price*quantity);
			hs.setQuantity(quantity);
			// 新买，cost已经有了，不需要再changeCost
			// hs.changeCost(price, quantity);
			this.holdingStocks.push(hs);
		}
		else {
			let orgHs = this.holdingStocks[index];
			holdingId = orgHs.id;
			let holdingQuantity = orgHs.quantity + quantity;
			orgHs.setQuantity(holdingQuantity);
			orgHs.changeCost(price, quantity);
		}
		if (this.cash) {
			this.cash -= price * quantity;
		}
		await this.bookHolding(holdingId, price, quantity);
	}

	async buyHolding(stockId: number, price: number, quantity: number) {
		let index = this.holdingStocks.findIndex(v => v.stock === stockId);
		if (index < 0) return;
		let orgHs = this.holdingStocks[index];
		let holdingId = orgHs.id;
		let holdingQuantity = orgHs.quantity + quantity;
		orgHs.setQuantity(holdingQuantity);
		orgHs.changeCost(price, quantity);
		if (this.cash) {
			this.cash -= price * quantity;
		}
		await this.bookHolding(holdingId, price, quantity);
	}

	private async saveHolding(stock:number): Promise<number> {
		let ret = await this.store.yumi.Acts({
			holding: [{account: this.id, stock, everBought: 1}]
		});
		return ret.holding[0];
	}

	private async bookHolding(holdingId:number, price:number, quantity:number): Promise<void> {
		this.recalc();
		await this.store.yumi.Acts({
			accountValue: [{
				id: this.id,
				miValue: this.miValue,
				market: this.market,
				count: this.count,
				cash: {value: this.cash, setAdd: '='},
			}],
			accountHolding: [{
				ix: this.id,
				xi: holdingId
			}],
			portfolio: [{
				id: holdingId,
				quantity: quantity,
				cost: price * quantity,
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

	private async bookSetCost(holdingId:number, cost:number): Promise<void> {
		this.recalc();
		await this.store.yumi.Acts({
			accountValue: [{
				id: this.id,
				miValue: this.miValue,
				market: this.market,
				count: this.count,
			}],
			portfolio: [{
				id: holdingId,
				cost: {value:cost, setAdd: '='},
			}],
		});
	}

	async sellHolding(stockId: number, price: number, quantity: number) {
		let holding = this.holdingStocks.find(v => v.stock === stockId);
		if (holding === undefined) return;
		holding.setQuantity(holding.quantity - quantity);
		holding.changeCost(-price, quantity);
		if (this.cash) {
			this.cash += price * quantity;
		}
		await this.bookHolding(holding.id, price, -quantity);
	}

	async changeCost(stockId: number, costPrice: number) {
		let holding = this.holdingStocks.find(v => v.stock === stockId);
		if (holding === undefined) return;
		holding.setCostPrice(costPrice);
		await this.bookSetCost(holding.id, costPrice * holding.quantity);
	}

	addHoldingStock(holdingStock: HoldingStock) {
		if (this.holdingStocks) {
			this.holdingStocks.push(holdingStock);
			this.recalc();
		}
	}

	removeHoldingStock(stockId: number) {
		if (this.holdingStocks) {
			let index = this.holdingStocks.findIndex(v => v.stock === stockId);
			if (index >= 0) {
				this.holdingStocks.splice(index, 1);
				this.recalc();
			}
		}
	}

	private recalc() {
		this.count = this.holdingStocks.length;
		let sumMiValue = 0, sumMarket = 0, sumDivident = 0, boughtCount = 0;
		for (let hs of this.holdingStocks) {
			let {stockObj, market, divident, quantity, everBought} = hs;
			if (everBought === 0) continue;
			let {miRate} = stockObj;
			let miValue = (miRate??0) * market / 100;
			hs.miValue = miValue;
			sumMiValue += miValue;
			sumMarket += market;
			sumDivident += divident;
			if (quantity > 0) ++boughtCount;
		}
		this.miValue = sumMiValue;
		this.market = sumMarket;
		this.divident = sumDivident;
		this.buyableCount = this.portion - boughtCount;
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
