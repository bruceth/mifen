import { ID, IX, PageItems, Uq } from "tonva-react";
import { IDBase } from "../base";
import { CIDSelect } from "../CIDSelect";
import { CIDView } from "../CIDView";
import { CUqUi, XIListUiProps } from "../props";
import { VIXRight } from "./VIXRight";
import { VXIList } from "./VXIList";

export class CXIList<TIX extends IDBase, TXI extends IDBase> extends CUqUi<XIListUiProps<TIX, TXI>> {
	pageItems: XIPageItems<TIX, TXI>;

	protected async internalStart() {
		let {ID, IX, xi} = this.props;
		this.pageItems = new XIPageItems<TIX, TXI>(this.uq, ID, IX, xi);
		await this.pageItems.first({});
		this.openVPage(VXIList);
	}

	// 增加所属的IX
	onSetIXItem = async () => {
		let {onSetIXItem} = this.props;
		if (onSetIXItem === null) return;
		if (onSetIXItem !== undefined) {
			await onSetIXItem();
			return;
		}
		let {uq, ID, IX, xi} = this.props;
		let cIDSelect = new CIDSelect({
			uq,
			ID,
		});
		let ret:TIX = await cIDSelect.call();
		if (!this.pageItems.findItem(ret)) {
			await uq.ActIX({
				IX,
				values: [{ix:ret.id, xi: xi.id}]
			});
			this.pageItems.append(ret);
		}
		this.closePage();
	}

	onClickItem = async (item:any) => {
		let {props} = this;
		let {onClickItem} = props;
		if (onClickItem === null) return;
		if (onClickItem !== undefined) return await onClickItem(item);
		let cIDView = new CIDView<any>({
			...props, 
			renderRight: () => this.renderView(VIXRight, item),
			onItemChanged: null, //this.onItemChanged
		});
		await cIDView.start(item);
	}

	breakChain = async (item: TIX) => {
		let {uq, IX, xi} = this.props;
		await uq.ActIX({
			IX,
			values: [{ix:item.id, xi: -xi.id}]
		});
		this.pageItems.removeItem(item);
		this.closePage();
	}
}

class XIPageItems<TIX extends IDBase, TXI extends IDBase> extends PageItems<TIX> {
	private uq:Uq;
	private ID: ID;
	private IX: IX;
	private xi: TXI;
	constructor(uq:Uq, ID:ID, IX:IX, xi:TXI) {
		super(true);
		this.uq = uq;
		this.ID = ID;
		this.IX = IX;
		this.xi = xi;
	}
	getPageId(item:TIX) {return item?.id}
	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let ret = await this.uq.QueryID<TXI>({
			IX: ['!' + this.IX.name],
			IDX: [this.ID],
			ix: this.xi?.id,
			page: {start:pageStart, size:pageSize},
		});
		return {$page:ret};
	}
	update(item:TIX) {
		let orgItem = this._items.find(v => v.id === item.id);
		if (orgItem) {
			Object.assign(orgItem, item);
		}
		else {
			this._items.unshift(item);
		}
	}
}
