import { IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { ParamIX } from "tonva-react";
import { AccountValue, Account, UqExt } from "uq-app/uqs/BruceYuMi";
import { HoldingStock, MiAccount } from "./miAccount";

export class MiAccounts {
	private yumi: UqExt
	accounts: IObservableArray<MiAccount> = null;

	constructor(yumi: UqExt) {
		makeObservable(this, {
			accounts: observable,
		});
		this.yumi = yumi;
	}

	async load() {
		let {UserAccount, Account, AccountValue} = this.yumi;
		let param:ParamIX = {
			IX: UserAccount,
			IDX: [Account, AccountValue],
			ix: undefined,			// auto userId
		};
		let ret = await this.yumi.IX<Account&AccountValue>(param);
		if (ret.length === 0) {
			// 没有持仓账号，则创建默认账号
			//let accountNO = await Account.NO();
			let accountName = '我的持仓组合';
			let retActs = await this.yumi.ActIX({
				IX: UserAccount,
				ID: Account,
				values: [{
					ix: undefined, 
					id: {
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
		runInAction(() => {
			let accounts = ret.map(v => new MiAccount(this, v));
			this.accounts = observable(accounts);
		});
	}

	async loadAccountHoldings(account:MiAccount):Promise<(HoldingStock)[]> {
		if (account.stockHoldings) return;
		let {id} = account;
		/*	
		let ret = this.yumi.a.groupMyAll.stocks.filter(v => {
			let stockId = v.id;
			let ok = this.groupStocks.findIndex(gs => {
				let {ix, id:gStockId} = gs;
				return ix===id && gStockId===stockId;
			}) >= 0;
			return ok;
		});
		return ret;
		*/
		return undefined as any;
	}

}
