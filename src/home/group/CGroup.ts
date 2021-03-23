import { IObservableArray, makeObservable, observable } from "mobx";
import { MiAccount, MiGroup, HoldingStock } from "../../store";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqBase } from "../../uq-app";
import { VGroups } from "./VGroups";
import { CHome } from "home/CHome";

export class CGroup extends CUqBase {
	private readonly cHome: CHome;
	miGroup: MiGroup = null;
	stocks: IObservableArray<Stock & StockValue>;
	miAccount: MiAccount = null;
	holdingStock: HoldingStock;
	listCaption: string;

	constructor(cApp: CApp, cHome: CHome) {
		super(cApp);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
			stocks: observable,
		});
		this.cHome = cHome;
	}

	async internalStart(param: any) {
	}

	renderGroups() {return this.renderView(VGroups);}

	showMiGroup = async (miGroup: MiGroup) => {
		this.cHome.openStocksList(miGroup.name);
		await miGroup.loadItems();
		this.cHome.setStocksList(miGroup.stocks);
	}

	onStockClick = async (stock: Stock) => {
		let {name, code, market, rawId} = stock;
		rawId = 1;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let dt = date.getDate();
		this.cApp.showStock({
			id: rawId, 
			name,
			code,
			symbol: market,
			day: year*10000 + month*100 + dt,
			stock
		} as any);
	}
}
