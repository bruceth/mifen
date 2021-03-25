import { IObservableArray, makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { VHome } from "./VHome";
import { CAccount } from "./account";

export class CHome extends CUqBase {
	readonly cAccount: CAccount;
	stocks: IObservableArray<Stock & StockValue> = null;
	listCaption: string = null;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			stocks: observable.ref,
			listCaption: observable,
		});
		this.cAccount = this.newSub(CAccount);
	}

	protected async internalStart(param: any) {
		this.openVPage(VHome);
	}

	tab = () => {
		return this.renderView(VHome);
	}

	onStockClick = async (stock: Stock) => {
		this.cApp.cCommon.showStock(stock);
	}
}
