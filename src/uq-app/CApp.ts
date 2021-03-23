//import { CHome } from "./home";
//import { CMe } from "./me";
import { CBug } from "./bug";
import { CUqApp } from "./CBase";
import { res } from "./res";
import { VMain } from "./VMain";
import { CTester } from "./test-uqui";
import { setUI } from "./uqs";
//import { CHome } from '../home';
import { CMe } from '../me';
import { CExplorer } from '../explorer';
import { CWarning } from '../warning';
import { CPredictHistory } from '../predicthistory';
//import { CUqApp } from './CBase';
//import { res } from './res';
//import { CHolding } from 'holding';
//import { VMain } from './VMain';
import { Store } from 'store';
import { MiNet } from '../net';
import { CHome } from '../home';
import { CStockInfo, NStockInfo } from "stockinfo";
import { CFind } from "find";
import { Stock, StockValue } from "./uqs/BruceYuMi";
import { CCommon } from "../common";

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	//cHome: CHome;
	cBug: CBug;
	cMe: CMe;
	cUI: CTester;
	//cGroup: CGroup;
	cHome: CHome;
	cFind: CFind;
	cExporer: CExplorer;
	cWarning: CWarning;
	cCommon: CCommon;
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
		
		//this.cHome = this.newC(CHome);
		this.cExporer = this.newC(CExplorer);
		this.cHome = this.newC(CHome);
		this.cFind = this.newC(CFind);
		this.cMe = this.newC(CMe);
		this.cWarning = this.newC(CWarning);
		this.cCommon = this.newC(CCommon);
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

	showStock = (item: NStockInfo) => {
		let cStockInfo = this.newC(CStockInfo);
		cStockInfo.start(item);
	}

	openStock = (stock: Stock & StockValue) => {
		let {name, code, market, rawId} = stock;
		rawId = 1;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let dt = date.getDate();
		this.showStock({
			id: rawId, 
			name,
			code,
			symbol: market,
			day: year*10000 + month*100 + dt,
			stock
		} as any);
	}
}
