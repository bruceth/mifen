import { IObservableArray, makeObservable, observable } from "mobx";
import { createPickId } from "tonva-uqui";
import { MiAccount, MiGroup, HoldingStock } from "../../store";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqBase } from "../../uq-app";
import { VAccount } from "./VAccount";
import { VBuyExist, VBuyNew, VCashAdjust, VCashInit, VCashIn, VCashOut, VSell } from "./VForm";
import { CHome } from "home/CHome";
import { VAccounts } from "./VAccounts";

export class CAccount extends CUqBase {
	private cHome: CHome;
	miGroup: MiGroup = null;
	stocks: IObservableArray<Stock & StockValue>;
	stock: Stock & StockValue;
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

	renderAccounts() {
		return this.renderView(VAccounts);
	}

	showAccount = async (item: MiAccount) => {
		this.miAccount = item;
		this.openVPage(VAccount);
		await item.loadItems();
	};
	
	showHolding = async (item: HoldingStock) => {
		let stock = item.stockObj;
		this.cApp.cCommon.showStock(stock);
	}

	createPickStockId() {
		let yumi = this.uqs.BruceYuMi;
		return createPickId(yumi, yumi.Stock);
	}

	showBuy = async (item?: HoldingStock) => {
		if (item) {
			this.holdingStock = item;
			this.openVPage(VBuyExist);
		}
		else {
			this.holdingStock = undefined;
			this.openVPage(VBuyNew);
		}
	}

	submitBuyNew = async (stockId: number, price:number, quantity:number) => {
		await this.miAccount.buyNewHolding(stockId, price, quantity);
	}

	submitBuy = async (price:number, quantity:number) => {
		await this.miAccount.buyHolding(this.holdingStock.stock, price, quantity);
	}

	showSell = async (item: HoldingStock) => {
		this.holdingStock = item;
		this.openVPage(VSell);
	}

	submitSell = async (price:number, quantity:number) => {
		await this.miAccount.sellHolding(this.holdingStock.stock, price, quantity);
	}
	
	showCashInit = async () => {
		this.openVPage(VCashInit);
	}

	submitCashInit = async (value:number) => {
		await this.miAccount.cashInit(value);
	}

	showCashIn = async () => {
		this.openVPage(VCashIn);
	}

	submitCashIn = async (value:number) => {
		await this.miAccount.cashIn(value);
	}
	
	showCashOut = async () => {
		this.openVPage(VCashOut);
	}

	submitCashOut = async (value:number) => {		
		await this.miAccount.cashOut(value);
	}
	
	showCashAdjust = async () => {
		this.openVPage(VCashAdjust);
	}

	submitCashAdjust = async (value:number) => {
		await this.miAccount.cashAdjust(value);
	}
}
