import { makeObservable, observable } from "mobx";
import { ParamID, ParamIDinIX } from "tonva-react";
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
		let param:ParamIDinIX = {
			ID: Account,
			IX: UserAccount,
			id: undefined,			// auto userId
		};
		let ret = await this.yumi.IDinIX<Account>(param);
		if (ret.length === 0) {
			// 没有持仓账号，则创建默认账号
			let accountNO = await Account.NO();
			//let retActs = 
			await this.yumi.Acts({
				account: [{
					id: undefined, 
					no: accountNO, 
					name: '我的持仓组合', 
				}]
			});
			ret = await this.yumi.IDinIX(param);
		}
		let paramValue:ParamID = {
			IDX: this.yumi.AccountValue,
			id: ret.map((v:any) => (v as unknown as Account).id),
		}
		let values = await this.yumi.ID<AccountValue>(paramValue);
		this.accounts = ret as unknown as (Account&AccountValue)[];
		this.accounts.forEach(account => {
			let {id} = account;
			let value = values.find((v:any) => v.id === id);
			if (value) {
				Object.assign(account, value);
			}
		});
	}
}
