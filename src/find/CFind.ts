import { makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { StockPageItems } from "./stockPageItems";
import { VFind } from "./VFind";
import { VStocksPage } from "./VStocksPage";

type SearchOrder = 'miRateDesc' | 'miRateAsc' | 'dvRateDesc' | 'dvRateAsc' | 'roeDesc' | 'roeAsc';

export class CFind extends  CUqBase {
	header: string = null;
	pageStocks: StockPageItems = null;
	searchOrder: SearchOrder = 'miRateDesc';

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			header: observable,
			//miAccount: observable,
		});
	}

	tab = () => {
		return this.renderView(VFind);
	}

	async internalStart(param: any) {
		this.openVPage(VFind);
	}

	load = async() => {}
	
	private async searchStock(header: string, market?:string[], key?:string) {
		this.header = header;
		this.pageStocks = new StockPageItems(this.cApp.store);
		await this.pageStocks.first({
			key, 
			market: market?.join('\n'),
			$orderSwitch: this.searchOrder,
		});
		this.openVPage(VStocksPage);
	}

	onSearch = async (key:string) => {
		await this.searchStock('搜索 - ' + key, ['sh', 'sz', 'hk'], key);
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
