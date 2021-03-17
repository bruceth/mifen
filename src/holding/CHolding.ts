import { CApp, CUqBase } from "../uq-app";
import { Account, AccountValue } from "../uq-app/uqs/BruceYuMi";
import { VHolding } from "./VHolding";
import { VAccount } from "./VAccount";
import { MiAccounts } from "store/miAccounts";
import { makeObservable, observable } from "mobx";
import { res } from "./res";

export class CHolding extends CUqBase {
	miAccounts: MiAccounts;
	miAccount: Account & AccountValue = null;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			miAccount: observable,
		});
		this.setRes(res);
		this.miAccounts = cApp.store.miAccounts;
	}

	protected async internalStart() {
	}
	
	tab = () => {
		return this.renderView(VHolding);
	}

	showAccount = async (item:Account&AccountValue) => {
		this.miAccount = item;
		this.openVPage(VAccount);
	};
}
