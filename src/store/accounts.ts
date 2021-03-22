import { makeObservable, observable } from "mobx";
import { MiNet } from "../net";
import { Account } from "./types";

export class Accounts {
	private miNet: MiNet;
	accounts: Account[] = null;
	account: Account = null;

	constructor(miNet: MiNet) {
		makeObservable(this, {
			accounts: observable,
			account: observable,
		});
		this.miNet = miNet;
	}

	async load() {
		// let r = await this.miNet.t_allaccounts();
		// if (Array.isArray(r)) {
		// 	this.accounts = r;
		// }
	}

	setCurrentAccount(name:string):Account {
		this.account = this.accounts.find(v => v.name === name);
		return this.account;
	}
}
