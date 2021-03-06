/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { Controller, VPage } from 'tonva-react';
import { CHome } from '../home';
import { CMe } from '../me';
import { CExplorer } from '../explorer';
import { CWarning } from '../warning';
import { CPredictHistory } from '../predicthistory';
import { CUqApp } from './CBase';
import { res } from './res';
import { CHolding } from 'holding';
import { VMain } from './VMain';
import { Store } from 'store';
import { MiNet } from '../net';

export class CApp extends CUqApp {
	cHome: CHome;
	cHolding: CHolding;
	cExporer: CExplorer;
	cWarning: CWarning;
	cMe: CMe;
	miNet: MiNet;
	store: Store;

	protected async internalStart() {
		this.setRes(res);

		this.miNet = new MiNet(this.user);
		this.store = new Store(this.user, this.miNet);
		await this.store.load();
		
		this.cHome = this.newC(CHome);
		this.cExporer = this.newC(CExplorer);
		this.cHolding = this.newC(CHolding);
		this.cMe = this.newC(CMe);
		this.cWarning = this.newC(CWarning);

		this.openVPage(VMain);
	}

	openPredictAVG(param:any) {
		let pc = this.newC(CPredictHistory);
		pc.start(param);
	}

	async showOneVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void> {
		await (new vp(this)).open(param);
	}

	protected onDispose() {
	}
}
