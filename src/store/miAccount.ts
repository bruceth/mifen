import { makeObservable, observable, runInAction } from "mobx";
import { ParamIX } from "tonva-react";
import { AccountValue, UqExt } from "uq-app/uqs/BruceYuMi";
import { Account } from "./types";

export class MiAccounts {
	private yumi: UqExt
	accounts: (Account&AccountValue)[] = null;

	constructor(yumi: UqExt) {
		makeObservable(this, {
			accounts: observable,
		});
		this.yumi = yumi;
	}

	async load() {
		let {Account, UserAccount} = this.yumi;
		let param:ParamIX = {
			IX: UserAccount,
			IDX: [Account],
			id: undefined,			// auto userId
		};
		let ret = await this.yumi.IX<Account>(param);
		if (ret.length === 0) {
			// 没有持仓账号，则创建默认账号
			//let accountNO = await Account.NO();
			let accountName = '我的持仓组合';
			let retActs = await this.yumi.ActIX({
				IX: UserAccount,
				ID: Account,
				values: [{
					id: undefined, 
					id2: {
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
			if (this.accounts) {
				this.accounts.splice(0, this.accounts.length, ...ret as unknown as (Account&AccountValue)[]);
			}
			else {
				this.accounts = ret as unknown as (Account&AccountValue)[];
			}
		});
	}
}
