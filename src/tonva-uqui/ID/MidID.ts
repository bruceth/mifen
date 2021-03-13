import { ID, Schema, UiSchema, Uq, Prop, UiButton, UiItemCollection, IDUI } from "tonva-react";
import { buildGridProps } from "../tools";
import { IDBase, Mid } from "../base";

export class MidID<T extends IDBase> extends Mid {
	readonly IDUI: IDUI;
	readonly ID: ID;
	constructor(uq: Uq, IDUI: IDUI) {
		super(uq);
		this.IDUI = IDUI;
		this.ID = IDUI.ID;
	}

	async init():Promise<void> {
		await this.loadSchema();
		this._itemSchema = await this.buildItemSchema(this.IDUI);
		await this.setDefaultNo();
		this._uiSchema = this.buildUISchema(this.IDUI);
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
		return this._props = buildGridProps(this.ID.ui);
	}

	protected async setDefaultNo() {
		for (let fieldItem of this._itemSchema) {
			if (fieldItem.name === 'no') {
				let no = await this.ID.NO();
				this.setNO(no, fieldItem);
			}
		}
	}
}
