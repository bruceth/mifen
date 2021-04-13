import { action, IObservableArray, makeObservable, observable } from "mobx";
import { ParamIX } from "tonva-react";
import { AccountValue, Account, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { HoldingStock } from "./holdingStock";
import { MiAccount } from "./miAccount";
import { Store } from "./store";

export class MiAccounts {
	private store: Store;
	accounts: IObservableArray<MiAccount> = null;

	constructor(store: Store) {
		makeObservable(this, {
			accounts: observable,
			load: action,
		});
		this.store = store;
	}

	async load() {
		let {yumi} = this.store;
		let {UserAccount, Account, AccountValue} = yumi;
		let param:ParamIX = {
			IX: UserAccount,
			IDX: [Account, AccountValue],
			ix: undefined,			// auto userId
		};
		let ret = await yumi.IX<Account&AccountValue>(param);
		if (ret.length === 0) {
			// 没有持仓账号，则创建默认账号
			//let accountNO = await Account.NO();
			let accountName = '我的持仓组合';
			let retActs = await yumi.ActIX({
				IX: UserAccount,
				ID: Account,
				values: [{
					ix: undefined, 
					xi: {
						name: accountName, 
					}
				}]
			});
			//ret = await this.yumi.IDinIX(param);
			ret.push({
				id: retActs[0],
				name: accountName,
			} as any);
		}
		let accounts = ret.map(v => new MiAccount(this.store, v));
		this.accounts = observable(accounts);
	}

	accountsFromIds(ids: number[]): MiAccount[] {
		let ret:MiAccount[] = [];
		let len = this.accounts.length;
		for (let i=0; i<len; i++) {			
			let account = this.accounts[i];
			if (ids.findIndex(v => v === account.id) >= 0) {
				ret.push(account);
			}
		}
		return ret;
	}

	async addStockToAccount(stock: Stock & StockValue, account: MiAccount) {
		let {yumi} = this.store;
		let {holdingStocks} = account;
		if (holdingStocks) {
			let index = holdingStocks.findIndex(v => v.stock === stock.id);
			if (index >= 0) return;
		}
		let ret = await yumi.ActIX({
			IX: yumi.AccountHolding,
			ID: yumi.Holding,
			values: [{ix: account.id, xi: {account:account.id, stock:stock.id, everBought: 0}}],
		});
		let hs = new HoldingStock(ret[0], stock, 0, 0);
		hs.everBought = 0;
		account.addHoldingStock(hs);
	}

	async removeStockFromAccount(stock: Stock & StockValue, account: MiAccount) {
		let {yumi} = this.store;
		await yumi.ActIX({
			IX: yumi.AccountHolding,
			values: [{ix: account.id, xi: -stock.id}],
		});
		account.removeHoldingStock(stock.id);
	}
}
