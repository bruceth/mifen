import { Holding, Portfolio, Stock, StockValue } from "uq-app/uqs/BruceYuMi";

export class HoldingStock implements Holding, Portfolio {
	id: number;
	account: number;
	stock: number;
	price: number;
	quantity: number;
	cost: number;
	miValue: number;				// 米息
	market: number;			// 市值
	divident: number;		// 股息
	stockObj: Stock & StockValue;

	constructor(holdingId: number, stock: Stock & StockValue, quantity: number, cost: number) {
		this.id = holdingId;
		this.stock = stock.id;
		this.stockObj = stock;
		this.price = stock.price;
		this.cost = cost? cost : quantity * this.price;
		this.setQuantity(quantity);
	}

	setQuantity(quantity: number) {
		this.quantity = quantity;
		let {divident, miRate} = this.stockObj;
		if (miRate === undefined) miRate = 0;
		if (divident === undefined) divident = 0;
		this.market = quantity * this.price;
		this.miValue = this.market * miRate / 100;
		this.divident = quantity * (divident ?? 0);
	}

	changeCost(price: number, quantity: number) {
		this.cost = this.cost + price * quantity;
	}

	setCostPrice(costPrice: number) {
		this.cost = this.quantity * costPrice;
	}
}
