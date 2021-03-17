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
	cash: number;

	stockHoldings: IObservableArray<HoldingStock> = null;

	constructor(miAccounts: MiAccounts, account: Account&AccountValue) {
		makeObservable(this, {
			stockHoldings: observable,
			count: observable,
			mi: observable,
			market: observable,
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
			this.stockHoldings = observable(ret, {deep: false});
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
		let sumMi = 0, sumMarket = 0;
		for (let sh of this.stockHoldings) {
			let {quantity, stockObj} = sh;
			let {price, miRate} = stockObj;
			sumMi += quantity * miRate;
			sumMarket += quantity * (price as number);
		}
		this.mi = sumMi;
		this.market = sumMarket;
	}

	changeCash(delta: number) {
		runInAction(() => {
			if (!this.cash) this.cash = delta;
			else this.cash += delta;
		});
	}
}

export class HoldingStock implements Holding, Portfolio {
	id: number;
	account: number;
	stock: number;
	order: number;
	quantity: number;
	stockObj: Stock & StockValue;
}
