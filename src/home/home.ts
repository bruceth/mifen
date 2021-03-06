import { StockGroup } from "store/stockGroup";
import { Store } from "../store";

export class Home {
	private store: Store;
	stockGroup: StockGroup;

	constructor(store: Store) {
		this.store = store;
	}

	async load() {
		this.stockGroup = this.store.getHomeStockGroup();
		if (!this.stockGroup) {
			debugger;
		}
		await this.stockGroup.loadItems();
		/*
    	let tagID = this.store.tagID;
    	if (tagID > 0) {
			if (this.lastLoadTick && Date.now() - this.lastLoadTick < 300*1000) return;
      		await this.store.loadHomeItems();
			this.lastLoadTick = Date.now();
		}
		*/
  	}

	get items() {return this.stockGroup.stocks;}
}
