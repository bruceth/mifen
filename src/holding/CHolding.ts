import { makeObservable, observable } from "mobx";
import { ParamID, ParamIDinIX } from "tonva-react";
import { CApp, CUqBase } from "UqApp";
import { Account, AccountValue } from "UqApp/uqs/BruceYuMi";
import { VHolding } from "./VHolding";
import { VAccount } from "./VAccount";

export class CHolding extends CUqBase {
	accounts: (Account&AccountValue)[];
	account: Account&AccountValue;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			accounts: observable,
		});
	}

	protected async internalStart() {
	}
	
	tab = () => {
		return this.renderView(VHolding);
	}

	load = async () => {
		let {BruceYuMi} = this.uqs;
		let {Account, UserAccount} = BruceYuMi;
		let param:ParamIDinIX = {
			ID: Account,
			IX: UserAccount,
			id: this.user.id,
		};
		let ret = await BruceYuMi.IDinIX<Account>(param);
		if (ret.length === 0) {
			// 没有持仓账号，则创建默认账号
			let accountNO = await BruceYuMi.IDNO({ID: Account});
			let retActs = await BruceYuMi.IDActs({
				account: [{
					id: undefined, 
					no: accountNO, 
					name: '我的持仓组合', 
				}]
			});
			ret = await BruceYuMi.IDinIX(param);
		}
		let paramValue:ParamID = {
			IDX: BruceYuMi.AccountValue,
			id: ret.map(v => (v as unknown as Account).id),
		}
		let values = await BruceYuMi.ID<AccountValue>(paramValue);
		this.accounts = ret as unknown as (Account&AccountValue)[];
		this.accounts.forEach(account => {
			let {id} = account;
			let value = values.find(v => v.id === id);
			if (value) {
				Object.assign(account, value);
			}
		});
	}

	showAccount = async (item:Account&AccountValue) => {
		this.account = item;
		this.openVPage(VAccount);
	};
}
