import { Holding, Portfolio, Stock, StockValue } from "uq-app/uqs/BruceYuMi";

export class HoldingStock implements Holding, Portfolio {
	id: number;
	account: number;
	stock: number;
	order: number;
	price: number;
	quantity: number;
	mi: number;				// 米值
	market: number;			// 市值
	divident: number;		// 股息
	stockObj: Stock & StockValue;

	constructor(holdingId: number, stock: Stock & StockValue, quantity: number) {
		this.id = holdingId;
		this.stock = stock.id;
		this.stockObj = stock;
		this.setQuantity(stock.price, quantity);
	}

	setQuantity(price: number, quantity: number) {
		this.price = price;
		this.quantity = quantity;
		let {miValue, divident} = this.stockObj;
		if (miValue === undefined) miValue = 0;
		if (divident === undefined) divident = 0;
		this.mi = quantity * miValue;
		this.market = quantity * price;
		this.divident = quantity * (divident ?? 0);
	}
}
