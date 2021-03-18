import { IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { Account, AccountValue, Stock, StockValue, Holding, Portfolio } from "uq-app/uqs/BruceYuMi";
import { MiAccounts } from "./miAccounts";

export class MiAccount  implements Account, AccountValue {
	protected readonly miAccounts: MiAccounts;
	id: number;
	no: string;
	name: string;
	count: number;
	mi: number;
	market: number;
	divident: number;
	cash: number;

	stockHoldings: IObservableArray<HoldingStock> = null;

	constructor(miAccounts: MiAccounts, account: Account&AccountValue) {
		makeObservable(this, {
			stockHoldings: observable,
			count: observable,
			mi: observable,
			market: observable,
			divident: observable,
			cash: observable,
		})
		this.miAccounts = miAccounts;
		Object.assign(this, account);
	}

	async loadItems() {
		if (this.stockHoldings) return;
		runInAction(() => {
			this.stockHoldings = undefined;
		});
		let ret = await this.miAccounts.loadAccountHoldings(this);
		if (!ret) ret = [];
		runInAction(() => {
			this.stockHoldings = observable(ret, {deep: true});
			this.count = this.stockHoldings.length;
		});
	}

	async addHolding(stock: Stock&StockValue, quantity: number) {
		let stockId = stock.id;
		let hs = new HoldingStock();
		hs.id = 0;
		hs.stock = stockId;
		hs.stockObj = stock;
		hs.quantity = quantity;
		let {price, miRate, divident} = stock;
		hs.mi = quantity * (price as number) * miRate / 100;
		hs.market = quantity * (price as number);
		hs.divident = quantity * (divident as number ?? 0);
		runInAction(() => {
			let index = this.stockHoldings.findIndex(v => v.stock === stockId);
			if (index < 0) {
				this.stockHoldings.push(hs);
			}
			else {
				let orgHs = this.stockHoldings[index];
				orgHs.quantity += quantity;
			}
			this.recalc();
		});
	}

	protected stockFromId(stockId:number): Stock & StockValue {
		return this.miAccounts.stockFromId(stockId);
	}

	async buyHolding(stockId: number, price: number, quantity: number) {
		let stock = this.stockFromId(stockId);
		let hs = new HoldingStock();
		hs.id = 0;
		hs.stock = stockId;
		hs.stockObj = stock;
		hs.quantity = quantity;
		let {miRate, divident} = stock;
		hs.mi = quantity * (price as number) * miRate / 100;
		hs.market = quantity * (price as number);
		hs.divident = quantity * (divident as number ?? 0);
		runInAction(() => {
			let index = this.stockHoldings.findIndex(v => v.stock === stockId);
			if (index < 0) {
				this.stockHoldings.push(hs);
			}
			else {
				let orgHs = this.stockHoldings[index];
				orgHs.quantity += quantity;
			}
			this.recalc();
		});
	}

	async sellHolding(stockId: number, price: number, quantity: number) {
		//let stockId = stock.id;
		let stock = this.stockFromId(stockId);
		let hs = new HoldingStock();
		hs.id = 0;
		hs.stock = stockId;
		hs.stockObj = stock;
		hs.quantity = quantity;
		let {miRate, divident} = stock;
		hs.mi = quantity * (price as number) * miRate / 100;
		hs.market = quantity * (price as number);
		hs.divident = quantity * (divident as number ?? 0);
		runInAction(() => {
			let index = this.stockHoldings.findIndex(v => v.stock === stockId);
			if (index < 0) {
				this.stockHoldings.push(hs);
			}
			else {
				let orgHs = this.stockHoldings[index];
				orgHs.quantity += quantity;
			}
			this.recalc();
		});
	}

	private recalc() {
		this.count = this.stockHoldings.length;
		let sumMi = 0, sumMarket = 0, sumDivident = 0;
		for (let sh of this.stockHoldings) {
			let {mi, market, divident} = sh;
			sumMi += mi;
			sumMarket += market;
			sumDivident += divident;
		}
		this.mi = sumMi;
		this.market = sumMarket;
		this.divident = sumDivident;
	}

	cashIn(amount: number) {
		runInAction(() => {
			if (!this.cash) this.cash = amount;
			else this.cash += amount;
		});
	}

	cashOut(amount: number) {
		runInAction(() => {
			// if (!this.cash) this.cash = amount;
			// else 
			this.cash -= amount;
		});
	}

	cashAdjust(amount: number) {
		runInAction(() => {
			if (!this.cash) this.cash = amount;
			else this.cash += amount;
		});
	}
}

export class HoldingStock implements Holding, Portfolio {
	id: number;
	account: number;
	stock: number;
	order: number;
	quantity: number;
	mi: number;				// 米值
	market: number;			// 市值
	divident: number;		// 股息
	stockObj: Stock & StockValue;
}
