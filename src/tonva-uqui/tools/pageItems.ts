import { PageItems } from "tonva-react";
import { IDBase } from "../base";

export type IDItemsPageLoader<T> = (pageStart:any, pageSize:number) => Promise<T[]>;
export type HistoryPageLoader<T> = (id:number, field:string, far:number, near:number, pageStart:any, pageSize:number) => Promise<T[]>;

export abstract class ListPageItems<T> extends PageItems<T> {
	private comPage: IDItemsPageLoader<T>;
	constructor(comPage: IDItemsPageLoader<T>) {
		super(true);
		this.comPage = comPage;
	}

	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let ret = await this.comPage(pageStart, pageSize);
		return {$page:ret};
	}
}

export class HistoryPageItems<T extends IDBase> extends PageItems<T> {
	private comPage: HistoryPageLoader<T>;
	constructor(comPage: HistoryPageLoader<T>) {
		super(true);
		this.comPage = comPage;
	}

	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let {id, field, far, near} = param;
		let ret = await this.comPage(id, field, far, near, pageStart, pageSize);
		return {$page:ret};
	}
}
