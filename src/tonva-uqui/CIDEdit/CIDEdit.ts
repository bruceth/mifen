import { runInAction } from "mobx";
import { Context } from "node:vm";
import { ButtonSchema, FieldItem, FieldItemId, FieldItemString, PickId, Schema, UiButton, UiItemCollection, UiSchema } from "tonva-react";
import { IDBase } from "../base";
import { CFormView, FormUI } from "../form";
import { CIDBase } from "../CIDBase";
import { IDEditUiProps } from "../props";
import { VIDEdit } from "./VIDEdit";

export class CIDEdit<T extends IDBase> extends CIDBase<T, IDEditUiProps<T>> {
	cFormView: CFormView<T>;

	protected async internalStart(item: T) {
		let {ID} = this.props;
		this.item = item;
		await this.loadSchema();
		this._itemSchema = await this.buildItemSchema();
		this._uiSchema = this.buildUISchema();
		this.createFormView();
		await this.cFormView.setNO(ID);
		this.openVPage(VIDEdit);
	}

	protected createFormView() {
		let {ID, fieldCustoms} = this.props;
		let formUI = new FormUI(ID.ui, fieldCustoms, ID.t);
		this.cFormView = new CFormView(formUI);
		this.cFormView.onSubmit = this.onSubmit;
	}

	private onSubmit = async (name:string, context: Context) => {
		await this.saveID(context.data);
		this.closePage();
	}

	async saveID(itemProps:any) {
		let {ID, onItemChanged, saveItem} = this.props;
		let id = this.item?.id;
		let item = {
			...itemProps,
			id,
		}

		if (!saveItem) {
			saveItem = async (item: T) => {
				let param: any = {};
				param[ID.name] = [item];
				let ret = await this.uq.Acts(param);
				let row = ret[ID.name];
				if (row) {
					id = row[0];
					return id;
				}
			}
		}
		let retId = await saveItem(item);
		if (retId) {
			item.id = retId;
		}

		if (onItemChanged) {
			await onItemChanged(item);
		}
		runInAction(() => {
			if (this.item)
				Object.assign(this.item, item);
			else
				this.item = item;
		});
		//this.valueChanged = true;
		//return ret;
	}

	protected async buildItemSchema(): Promise<Schema> {
		let {ID} = this.props;
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
				//let importSelect = await import('../select');
				//this.setIDUi(fieldItem, importSelect.createPickId(this.uq, ID), ID.render);
			}
		}
		ret.push({
			name: 'submit',
			type: 'submit',
		} as ButtonSchema);
		return ret;
	}

	protected buildUISchema():UiSchema {
		let {ID} = this.props;
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
		await this.props.ID.loadSchema();
	}

	private _itemSchema: Schema;
	get itemSchema(): Schema {return this._itemSchema;}

	private _uiSchema: UiSchema;
	get uiSchema(): UiSchema {return this._uiSchema;}

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
