import { action, makeObservable, observable, runInAction } from "mobx";
import { IDBase } from "../base";
import { TimeSpan } from "../tools";
import { CUqUi, IDXUiProps } from "../props";
import { VIDX } from "./VIDX";
import { res } from './res';
import { VView } from "./VView";
import { VEdit } from "./VEdit";
import { Prop, Schema, UiSchema } from "tonva-react";

export class CIDX<T extends IDBase> extends CUqUi<IDXUiProps<T>> {
	timeSpan:TimeSpan = null;
	spanValues: any = null;
	dayValues: number[] = null;

	constructor(props: IDXUiProps<T>) {
		super(props);
		makeObservable(this, {
			timeSpan: observable,
			spanValues: observable,
			dayValues: observable.ref,
			setTimeSpan: action,
		});
		this.setRes(res);
	}

	protected async internalStart() {
		this.openVPage(VIDX);
	}

	async showItemView(item: any) {
		await this.loadSchema();
		this.item = item;
		await this.setTimeSpan('month');
		this.openVPage(VView);
	}

	item:any;
	onItemClick: (item:any) => void = async (item:any) => {
		this.item = item;
		await this.setTimeSpan('month');
		this.openVPage(VView);
	}

	onItemEdit = async ():Promise<void> => {
		this.openVPage(VEdit);
	}

	async setTimeSpan(span: 'day'|'week'|'month'|'year') {
		let timeSpan = TimeSpan.create(span);
		this.timeSpan = timeSpan;
		await this.loadSum(timeSpan);
	}

	private async loadSum(timeSpan?: TimeSpan) {
		let {far, near} = timeSpan ?? this.timeSpan;
		let ret = await this.uqLoadSum(this.item.id, far, near);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let [values, sums] = ret;
		let sum = sums[0];
		runInAction(() => {
			this.spanValues = sum ?? {};
		});
		await this.loadDayValues();
	}

	prevTimeSpan = async () => {
		this.timeSpan.prev();
		await this.loadSum();
	}

	nextTimeSpan = async () => {
		this.timeSpan.next();
		await this.loadSum();
	}

	field:string;
	async loadDayValues() {
		let {far, near} = this.timeSpan;
		let ret = await this.uqLoadDayValues(this.item.id, this.field, far, near);
		let dayValues = this.timeSpan.getDayValues(ret);
		runInAction(() => {
			this.dayValues = dayValues;
		});
	}

	setCurrentField(field:string) {
		this.field = field;
		this.loadDayValues();
	}

	async saveFieldValue(field:string, t:number, value:number|string) {
		let {id} = this.item;
		await this.uqSaveFieldValue(id, field, t, value);
		let ret = await this.uqLoadFieldSum(id, field, this.timeSpan);
		let v= ret[field];
		this.spanValues[field] = v;
		return;
	}
	
	protected async loadSchema() {
		let {ID, IDX} = this.props;
		await Promise.all([
			IDX.loadSchema(),
			ID.loadSchema(),
		]);
		let IDUI = {ID};
		this._itemSchema = await this.buildItemSchema(IDUI);
		this._uiSchema = this.buildUISchema(IDUI);
		this._props = this.buildGridProps(IDX);
		let {exFields} = IDX.schema;
		for (let prop of this._props) {
			let {name} = prop as any;
			if (!name) continue;
			let ex = (exFields as any[])?.find(v => v.field === name);
			let time = ex?.time;
			if (!time) continue;
			(prop as any).time = time;
		}

	}

	async load(id:number): Promise<any[]> {
		let {ID, IDX} = this.props;
		let ret = await this.uq.ID({
			IDX: [ID, IDX],
			id,
			page: undefined,
		});
		return ret;
	}
	
	async showFieldHistory(field:string) {
		alert(field);
	}

	historyLoader = async (id:number, field:string, far:number, near:number, pageStart:any, pageSize:number):Promise<any[]> => {
		let {ID, IDX} = this.props;
		let ret = await this.uq.IDLog({
			IDX,
			field,
			id,
			log: 'each',
			far,
			near,
			page: {
				start: pageStart,
				size: pageSize,
			}
		});
		return ret;
	}

	async saveID(data:any):Promise<number> {
		let {ID} = this.props;
		let param: any = {};
		param[ID.name] = [data];
		let ret = await this.uq.Acts(param);
		let id = ret[ID.name];
		return id[0];
	}

	async uqSaveFieldValue(id:number, fieldName:string, t:any, value:string|number):Promise<void> {
		let param: any = {};
		let val: any = {id};
		val[fieldName] = {
			$time: t,
			value,
		}
		let {IDX} = this.props;
		param[IDX.name] = [val];
		let ret = await this.uq.Acts(param);
		return ret;
	}

	async uqLoadFieldSum(id:number, field:string, timeSpan:TimeSpan):Promise<any> {
		let {far, near} = timeSpan;
		let {IDX} = this.props;
		let retSum = await this.uq.IDSum({
			IDX,
			field: [field],
			id,
			far,
			near,
		});
		let ret = retSum[0];
		return ret;
	}

	async uqLoadSum(id:number, far:number, near:number):Promise<[any[], any[]]> {
		let {IDX} = this.props;
		let valueFields:string[] = [];
		let {fields, exFields} = IDX.schema;
		if (exFields === undefined) {
			throw new Error('no valid sum field in exFields');
		}
		for (let ex of exFields) {
			let {field, log} =  ex;
			if (log !== true) continue;
			let f = (fields as any[]).find(v => v.name === field);
			if (f === undefined) continue;
			let {name, type} = f;
			if (['int', 'tinyint', 'smallint', 'bigint', 'dec', 'float', 'double'].indexOf(type) < 0) continue;
			valueFields.push(name);
		}
		return await Promise.all([
			this.uq.ID({
				IDX,
				id,
			}),
			this.uq.IDSum({
				IDX,
				field: valueFields,
				id,
				far,
				near,
			}),
		]);
	}

	async uqLoadDayValues(id:number, field: string, far:number, near:number):Promise<any[]> {
		if (!field) {
			field = (this._props[0] as any)?.name;
			if (!field) {
				debugger;
				alert('no field in loadDayValues');
			}
		}
		let {IDX} = this.props;
		let ret = await this.uq.IDLog({
			IDX,
			field,
			log: 'day',
			timeZone: this.timeZone,
			id,
			far,
			near,
			page: {
				start: near,
				end: far,
				size: 100,
			}
		});
		return ret;
	}

	private _itemSchema: Schema;
	get itemSchema(): Schema { return this._itemSchema; }

	private _uiSchema: UiSchema;
	get uiSchema(): UiSchema { return this._uiSchema; }

	private _props: Prop[];
	get gridProps():Prop[] { return this._props; }
}
