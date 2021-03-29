import { ID, Schema, UiSchema, Uq, Prop, UiButton, UiItemCollection, IDUI, IX, ParamActIX } from "tonva-react";
import { IDBase, Mid } from "../base";
import { MidIDList, MidIXIDList } from "./MidIDList";

export class MidID<T extends IDBase> extends Mid {
	readonly IDUI: IDUI;
	readonly ID: ID;

	constructor(uq: Uq, IDUI: IDUI) {
		super(uq);
		this.IDUI = IDUI;
		this.ID = IDUI.ID;
	}

	listHeader: string|JSX.Element;
	itemHeader: string|JSX.Element;

	async init():Promise<void> {
		await this.loadSchema();
		this._itemSchema = await this.buildItemSchema(this.IDUI);
		this._uiSchema = this.buildUISchema(this.IDUI);
	}

	createMidIDList():MidIDList<T> {
		let ret = new MidIDList<T>(this.uq, this.ID);
		ret.header = this.listHeader;
		return ret;
	}

	protected buildUISchema(IDUI:IDUI):UiSchema {
		let {ID} = IDUI;
		let items:UiItemCollection = {};
		this._uiSchema = {items};
		let {fields} = ID.ui;
		if (fields) {
			for (let f of this._itemSchema) {
				let {name} = f;
				Object.assign(f, (fields as any)[name]);
				(items as any)[name] = f;
			}
		}

		let uiButton: UiButton = {
			label: '提交',
			className: 'btn btn-primary',
			widget: 'button',
		};
		items['submit'] = uiButton;
		return this._uiSchema;
	}
	protected async loadSchema() {
		await this.ID.loadSchema();
	}

	async load(id:number): Promise<T[]> {
		let ret = await this.uq.ID<T>({
			IDX: this.ID,
			id,
			page: undefined,
		});
		return ret;
	}
	async saveID(data:any):Promise<number> {
		let param: any = {};
		param[this.ID.name] = [data];
		let ret = await this.uq.Acts(param);
		let id = ret[this.ID.name];
		if (!id) return;
		return id[0];
	}

	private _itemSchema: Schema;
	get itemSchema(): Schema {
		//if (this._itemSchema !== undefined) 
		return this._itemSchema;
		//return this._itemSchema = this.buildItemSchema(this.ID);
	}

	private _uiSchema: UiSchema;
	get uiSchema(): UiSchema {
		//if (this._uiSchema !== undefined) 
		return this._uiSchema;
		//return this._uiSchema = this.buildUISchema(this.ID);
	}

	private _props: Prop[];
	get props():Prop[] {
		if (this._props !== undefined) return this._props;
		return this._props = this.buildGridProps(this.IDUI.ID);
	}

	/*
	protected async setDefaultNo() {
		for (let fieldItem of this._itemSchema) {
			if (fieldItem.name === 'no') {
				let no = await this.ID.NO();
				this.setNO(no, fieldItem);
			}
		}
	}
	*/
}

export class MidIXID<T extends IDBase> extends MidID<T> {
	readonly IX: IX;
	constructor(uq: Uq, IDUI: IDUI, IX: IX) {
		super(uq, IDUI);
		this.IX = IX;
	}

	createMidIDList():MidIDList<T> {
		let ret = new MidIXIDList<any>(this.uq, this.ID, this.IX);
		ret.header = this.listHeader;
		return ret;
	}

	async saveID(data:any):Promise<number> {
		let param: ParamActIX<T> = {
			ID: this.ID,
			IX: this.IX,
			values: [
				{ix:undefined, id:data}
			],
		};
		let ret = await this.uq.ActIX(param);
		let id = ret[0];
		if (!id) return;
		return id;
	}
}
