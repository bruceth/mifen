import { ButtonSchema, Controller, FieldCustoms, FieldItem, FieldItemId, FieldItemString, ID, IDUI, IDX, IDXEntity, IX, PickId, Prop, Schema, UiButton, UiSchema, Uq } from "tonva-react";
import { IDBase } from "./base";

export interface UqUiProps {
	uq: Uq;
}

export interface IDBaseUiProps<T extends IDBase> extends UqUiProps {
	ID: ID;
	header?: string|JSX.Element;
	listHeader?: string|JSX.Element;
	renderRight?: () => JSX.Element;
	fieldCustoms?: FieldCustoms;
}

export interface IDListUiProps<T extends IDBase> extends IDBaseUiProps<T> {
	renderItem?: (item:T, index:number) => JSX.Element;
	onClickItem?: (item:T) => Promise<void>;
	onAddItem?: () => Promise<void>;
}

export interface IDUiProps<T extends IDBase> extends IDBaseUiProps<T> {
	onItemChanged?: (item: T) => Promise<void>;
}

export interface IDEditUiProps<T extends IDBase> extends IDUiProps<T> {
	saveItem?: (item: T) => Promise<number>;
}

export interface IDViewUiProps<T extends IDBase> extends IDUiProps<T> {
	onEditItem?: (item: T) => Promise<T>;
}

export interface IXListUiProps<TIX extends IDBase, TXI extends IDBase> extends IDListUiProps<TXI> {
	IX: IX;
	ix: TIX;		// if undefined, then current user
	renderIx?: (ix:TIX) => JSX.Element;
}

export interface IXUiProps<TIX extends IDBase, TXI extends IDBase> extends UqUiProps {
	ixProps?: IDListUiProps<TIX>;
	xiProps?: IXListUiProps<TIX, TXI>;
}

export interface XIUiProps<TXI extends IDBase, TIX extends IDBase> extends UqUiProps {
	xiProps?: IDListUiProps<TXI>;
	ixProps?: XIListUiProps<TXI, TIX>;
}

export interface XIListUiProps<TIX extends IDBase, TXI extends IDBase> extends IDListUiProps<TIX> {
	IX: IX;
	xi: TXI;		// if undefined, then current user
	renderXi?: (xi:TXI) => JSX.Element;
	onSetIXItem?: () => Promise<void>;
}

export interface IDXBaseUiProps<T extends IDBase> extends UqUiProps {
	readonly IDX: IDX;
	readonly ID: ID;
	readonly timeZone: number;
}

export interface IDXUiProps<T extends IDBase> extends IDXBaseUiProps<T> {
}

export interface IDXHistoryUiProps<T> extends IDXBaseUiProps<T> {
}

export abstract class CUqUi<P extends UqUiProps> extends Controller {
	protected uq: Uq;
	props: P;

	constructor(props: P) {
		super();
		this.uq = props.uq;
		this.props = props;
	}

	protected async buildItemSchema(IDUI: IDUI): Promise<Schema> {
		let {ID} = IDUI;
		let ret:Schema = [];
		let {fieldArr} = ID.ui;
		for (let f of fieldArr) {
			let {type, isKey} = f;
			let required = isKey; // (keys as any[]).findIndex(v => v.name === name) >= 0;
			let fieldItem = {
				...f,
				required,
			};
			switch (type) {
				default: ret.push(fieldItem); break;
			}
			let {ID} = fieldItem;
			if (ID) {
				let importSelect = await import('./CIDSelect');
				this.setIDUi(fieldItem, importSelect.createPickId(this.uq, ID), ID.render);
			}
		}
		ret.push({
			name: 'submit',
			type: 'submit',
		} as ButtonSchema);
		return ret;
	}

	protected buildUISchema(IDUI:IDUI):UiSchema {
		let {ID} = IDUI;
		let {fields} = ID.ui;
		let items = {...fields as any};
		let uiButton: UiButton = {
			label: '提交',
			className: 'btn btn-primary',
			widget: 'button',
		};
		items['submit'] = uiButton;
		let ret = {items};
		return ret;
	}

	protected buildGridProps(IDX: IDXEntity<any>):Prop[] {
		let ret:Prop[] = [];
		let {ui, t, schema} = IDX;
		let {exFields} = schema;
		let {fieldArr } = ui;
		for (let f of fieldArr) {
			let exField = (exFields as any[]).find(v => v.field === f.name);
			if (!exField) continue;
			let prop = {
				...f,
				label: t(f.label),
			};
			ret.push(prop as any);
		}
		return ret;
	}

	protected setIDUi(fieldItem:FieldItem, pickId: PickId, render: (values:any) => JSX.Element) {
		if (fieldItem.type !== 'id') {
			alert(`${fieldItem.name} is not id UI`);
			return;
		}
		let idField = fieldItem as FieldItemId;
		idField.widget = 'id';
		idField.pickId = pickId;
		(idField as any).Templet = render;
	}

	protected setNO(no:string, noFieldItem: FieldItem) {
		if (!noFieldItem) return;
		if (noFieldItem.type !== 'string') return;
		let noField = noFieldItem as FieldItemString;
		noField.readOnly = true;
		noField.defaultValue = no;
	}
}
