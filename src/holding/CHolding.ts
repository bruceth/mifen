import { CApp, CUqBase } from "../uq-app";
import { Account, AccountValue } from "../uq-app/uqs/BruceYuMi";
import { VHolding } from "./VHolding";
import { VAccount } from "./VAccount";
import { MiAccounts } from "store/miAccount";
import { makeObservable, observable } from "mobx";
import { CID, MidID } from "tonva-uqui";

export class CHolding extends CUqBase {
	miAccounts: MiAccounts;
	miAccount: Account & AccountValue = null;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			miAccount: observable,
		});
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

	showGroups = async () => {
		let uq = this.uqs.BruceYuMi;
		let mId = new MidID(uq, {ID:uq.Group});
		let cID = new CID(mId);
		await cID.start();
	}
}
