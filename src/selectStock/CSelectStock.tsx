import { PageItems } from 'tonva-react';
import { Stock } from 'store';
import { MiNet } from '../net';
import { CUqBase } from "../uq-app";
import { VStockSelect } from './VSelectStock';

class PageStockItems<T> extends PageItems<T> {
	private miNet: MiNet;

	constructor(miNet: MiNet) {
		super(true);
		this.miNet = miNet;
		this.firstSize = this.pageSize = 30;
	}

	protected async loadResults(param: any, pageStart: any, pageSize: number): Promise<{
			[name: string]: any[];
		}> {
		if (pageStart === undefined) pageStart = 0;
		let p = ['%' + param.key + '%'];
		try {
			//let ret = await this.cStock.cApp.store.miApi.page('q_stocks$page', p, pageStart, pageSize);
			let ret = await this.miNet.q_stocks$page(p, pageStart, pageSize);
			return {$page: ret};
		}
		catch (error) {
			let e = error;
			return undefined;
		}
	}

	protected setPageStart(item: any): any {
		this.pageStart = item === undefined ? 0 : item.id;
	}
}

export class CSelectStock extends CUqBase {
	pageItems: PageStockItems<Stock>;

	async internalStart(param: any) {
		this.pageItems = new PageStockItems<any>(this.cApp.miNet);
		this.openVPage(VStockSelect);
	}

	searchByKey = async (key: string) => {
		this.pageItems.first({ key: key });
	}

	//给调用页面返回id
	returnStock = async (item: any): Promise<any> => {
		this.returnCall(item);
	}

	onPage = async () => {
		await this.pageItems.more();
	}
}
