import { action, makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { StockPageItems } from "./stockPageItems";
import { VFind } from "./VFind";
import { VStocksPage } from "./VStocksPage";
import { CGroup } from "./group";

type SearchOrder = 'miRateDesc' | 'miRateAsc' | 'dvRateDesc' | 'dvRateAsc' | 'roeDesc' | 'roeAsc';
const defaultSmooth = 0;
export interface SearchParam {
	key: string; 
	market: string;
	$orderSwitch: SearchOrder;
	smooth: number;
}

export class CFind extends  CUqBase {
	readonly cGroup: CGroup;
	header: string = null;
	pageStocks: StockPageItems = null;
	searchOrder: SearchOrder = 'miRateDesc';
	searchParam: SearchParam;
	smooth: number;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			header: observable,
			smooth: observable,
			loadSmooth: action,
			changeSmooth: action,
		});
		this.cGroup = this.newSub(CGroup);
		this.loadSmooth();
	}

	tab = () => {
		return this.renderView(VFind);
	}

	async internalStart(param: any) {
		this.openVPage(VFind);
	}

	loadSmooth() {
		let t = localStorage.getItem('smooth');
		if (!t) this.smooth = defaultSmooth;
		else {
			try {
				this.smooth = Number.parseInt(t);
			}
			catch {
				this.smooth = defaultSmooth;
			}
		}
	}

	async changeSmooth(value: number) {
		if (this.smooth === value) return;
		this.smooth = value;
		localStorage.setItem('smooth', String(value));
		this.searchParam['smooth'] = value;
		await this.research();
	}

	load = async() => {}
	
	async research() {
		await this.pageStocks.first(this.searchParam);
	}

	private async searchStock(header: string, market?:string[], key?:string) {
		this.header = header;
		this.searchParam = {
			key, 
			market: market?.join('\n'),
			$orderSwitch: this.searchOrder,
			smooth: key? 0 : this.smooth,
		};
		this.pageStocks = new StockPageItems(this.cApp.store);
		await this.pageStocks.first(this.searchParam);
		this.openVPage(VStocksPage);
	}

	onSearch = async (key:string) => {
		await this.searchStock('搜索', ['sh', 'sz', 'hk'], key);
	}

	showA = async () => {
		await this.searchStock('A股', ['sh', 'sz']);
	}
	showHK = async () => {
		await this.searchStock('港股', ['hk']);
	}
	showSH = async () => {
		await this.searchStock('沪股', ['sh']);
	}
	showSZ = async () => {
		await this.searchStock('深股', ['sz']);
	}
	showAll = async () => {
		await this.searchStock('全部股票', ['sh', 'sz', 'hk']);
	}

	onClickStock = (stock: Stock & StockValue) => {

	}
}
