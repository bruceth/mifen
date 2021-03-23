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
		this.cApp.cCommon.showStock(stock);
	}
}
