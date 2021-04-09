import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { HoldingStock } from "./holdingStock";

function miRateSorter(a:number, b:number): number {
	if (a === null || a === undefined) return 1;
	if (b === null || b === undefined) return -1;
	if (a < b) return 1;
	if (a > b) return -1;
	return 0;
}

export const holdingMiRateSorter = (a:HoldingStock, b:HoldingStock) => {
	return miRateSorter(a.stockObj.miRate, b.stockObj.miRate);
}

export const stockMiRateSorter = (a:StockValue, b:StockValue) => {
	return miRateSorter(a.miRate, b.miRate);
}
