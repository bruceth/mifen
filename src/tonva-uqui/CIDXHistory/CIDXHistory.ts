import { PageItems } from "tonva-react";
import { TimeSpan } from "tonva-uqui/tools";
import { IDBase } from "../base";
import { CUqUi, IDXHistoryUiProps } from "../props";
import { VIDXHistory, VHistory } from "./VIDXHistory";

export class CIDXHistory<T> extends CUqUi<IDXHistoryUiProps<T>> {
	item: any;
	field: string;
	historyItems: HistoryPageItems<any>
	
	protected async internalStart() {
		this.openVPage(VIDXHistory);
	}

	async startFieldHistory(item: any, field:string) {
		let {ID, IDX} = this.props;
		await Promise.all([
			IDX.loadSchema(),
			ID.loadSchema(),
		]);
		this.item = item;
		this.field = field;
		let timeSpan = TimeSpan.create('year');
		this.historyItems.first({
			id: this.item.id,
			far: timeSpan.far,
			near: 1817507137000, //this.timeSpan.near,
			field
		});
	}

	renderFieldHistory() {
		return this.renderView(VHistory);
	}

	async showFieldHistory(field:string) {
		await this.startFieldHistory(this.item, field);
		this.openVPage(VIDXHistory);
	}

}

class HistoryPageItems<T extends IDBase> extends PageItems<T> {
	private readonly props: IDXHistoryUiProps<T>;
	constructor(props: IDXHistoryUiProps<T>) {
		super(true);
		this.props = props;
	}

	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let {id, field, far, near} = param;
		let {uq, IDX} = this.props;
		let ret = await uq.IDLog({
			field,
			id,
			IDX,
			log: 'each',
			page: {
				start: pageStart,
				size: pageSize,
			}
		})
		//let ret = await this.pageLoader(id, field, far, near, pageStart, pageSize);
		return {$page:ret};
	}
}
