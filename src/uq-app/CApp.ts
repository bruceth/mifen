//import { CHome } from "./home";
//import { CMe } from "./me";
import { CBug } from "./bug";
import { CUqApp } from "./CBase";
import { res } from "./res";
import { VMain } from "./VMain";
import { CTester } from "./test-uqui";
import { setUI } from "./uqs";
import { CHome } from '../home';
import { CMe } from '../me';
import { CExplorer } from '../explorer';
import { CWarning } from '../warning';
import { CPredictHistory } from '../predicthistory';
//import { CUqApp } from './CBase';
//import { res } from './res';
import { CHolding } from 'holding';
//import { VMain } from './VMain';
import { Store } from 'store';
import { MiNet } from '../net';
import { CGroup } from '../group';

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	cHome: CHome;
	cBug: CBug;
	cMe: CMe;
	cUI: CTester;
	cGroup: CGroup;
	cHolding: CHolding;
	cExporer: CExplorer;
	cWarning: CWarning;
	miNet: MiNet;
	store: Store;

	protected async internalStart(isUserLogin: boolean) {
		this.setRes(res);
		setUI(this.uqs);
		/*
		this.cHome = this.newC(CHome);
		this.cBug = this.newC(CBug);
		this.cMe = this.newC(CMe);
		this.cUI = this.newC(CTester) as CTester;
		this.cHome.load();
		*/
		this.miNet = new MiNet(this.user);
		this.store = new Store(this.miNet, this.uqs);
		await this.store.load();
		
		this.cHome = this.newC(CHome);
		this.cExporer = this.newC(CExplorer);
		this.cGroup = this.newC(CGroup);
		this.cHolding = this.newC(CHolding);
		this.cMe = this.newC(CMe);
		this.cWarning = this.newC(CWarning);
		if (this.isDev === true) {
			this.cBug = this.newC(CBug);
			this.cUI = this.newC(CTester) as CTester;
		}

		this.openVPage(VMain, undefined, this.dispose);
		// 加上下面一句，可以实现主动页面刷新
		// this.timer = setInterval(this.callTick, 1000);
		// uq 里面加入这一句，会让相应的$Poked查询返回poke=1：
		// TUID [$User] ID (member) SET poke=1;
	}

	openPredictAVG(param:any) {
		let pc = this.newC(CPredictHistory);
		pc.start(param);
	}

	showGroupsManage() {
		let cGroup = this.newC(CGroup);
		cGroup.start();
	}

	private timer:any;
	protected onDispose() {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	private tick = 0;
	private gapIndex = 0;
	private callTick = async () => {
		try {
			if (!this.user) return;
			++this.tick;
			if (this.tick<gaps[this.gapIndex]) return;
			//console.error('tick ', new Date());
			this.tick = 0;
			if (this.gapIndex < gaps.length - 1) ++this.gapIndex;
			let ret = await this.uqs.BzHelloTonva.$poked.query(undefined, false);
			let v = ret.ret[0];
			if (v === undefined) return;
			if (!v.poke) return;
			this.gapIndex = 1;

			// 数据服务器提醒客户端刷新，下面代码重新调入的数据
			//this.cHome.refresh();
		}
		catch {
		}
	}
}
