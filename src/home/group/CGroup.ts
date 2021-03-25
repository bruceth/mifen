import { IObservableArray, makeObservable, observable } from "mobx";
import { MiAccount, MiGroup, HoldingStock } from "../../store";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqSub, UQs } from "../../uq-app";
import { VGroups } from "./VGroups";
import { CHome } from "home/CHome";

export class CGroup extends CUqSub<CApp, UQs, CHome> {
	//private readonly cHome: CHome;
	miGroup: MiGroup = null;
	stocks: IObservableArray<Stock & StockValue>;
	miAccount: MiAccount = null;
	holdingStock: HoldingStock;
	listCaption: string;

	constructor(cHome: CHome) {
		super(cHome);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
			stocks: observable,
		});
		//this.cHome = cHome;
	}

	async internalStart(param: any) {
	}

	renderGroups() {return this.renderView(VGroups);}

	showMiGroup = async (miGroup: MiGroup) => {
		this.owner.openStocksList(miGroup.name);
		await miGroup.loadItems();
		this.owner.setStocksList(miGroup.stocks);
	}

	onStockClick = async (stock: Stock) => {
		this.cApp.cCommon.showStock(stock);
	}
}
