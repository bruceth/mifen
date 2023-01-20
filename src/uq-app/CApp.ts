import { CBug } from "./bug";
import { CUqApp } from "./CBase";
import { res } from "./res";
import { VMain } from "./VMain";
import { CTester } from "./test-uqui";
import { setUI } from "./uqs";
import { CMe } from '../me';
import { Store } from 'store';
import { CHome } from '../home';
import { CStockInfo, NStockInfo } from "stockinfo";
import { CFind } from "find";
import { Stock, StockValue } from "./uqs/BruceYuMi";
import { CCommon } from "../common";
import { CTrack } from "track";
import { CMirateAvg } from "mirateavg";

//const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	//cHome: CHome;
	cBug: CBug;
	cMe: CMe;
	cUI: CTester;
	//cGroup: CGroup;
	cHome: CHome;
	cFind: CFind;
	cCommon: CCommon;
	store: Store;
    cTrack: CTrack;

	protected async internalStart(isUserLogin: boolean) {
		this.setRes(res);
		setUI(this.uqs);
		this.store = new Store(this.uqs, this.user);
		await this.store.load();
		
		this.cHome = this.newC(CHome);
		this.cFind = this.newC(CFind);
		this.cMe = this.newC(CMe);
		this.cCommon = this.newC(CCommon);
        this.cTrack = this.newC(CTrack);
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

	private timer:any;
	protected onDispose() {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	private tick = 0;
	private gapIndex = 0;
	/*
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
	*/

	showStock = async (item: NStockInfo) => {
		await this.store.loadMyBlock();
		let cStockInfo = this.newC(CStockInfo);
		cStockInfo.start(item);
	}

	openStock = (stock: Stock & StockValue, trackDay?: number) => {
		let {id, name, no, rawId} = stock;
        let market = (stock as any).$market;
        let day = trackDay;
        if (day === undefined) {
		    let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();
            day = year*10000 + month*100 + dt;
        }
		this.showStock({
			id: id,
            rawId: rawId, 
			name,
			code: no,
            market: market.name,
			symbol: market.name + no,
			day: day,
            trackDay: trackDay,
			stock
		} as any);
	}

    showMirateAvg = (trackDay?: number) => {
        let cma = this.newC(CMirateAvg);
        cma.start({day: trackDay});
    }
}
