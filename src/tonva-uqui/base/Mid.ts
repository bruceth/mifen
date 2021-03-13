import { ButtonSchema, FieldItem, FieldItemId, FieldItemString, IDUI, Schema, UiButton, UiSchema, Uq } from "tonva-react";

export abstract class Mid {
	readonly uq: Uq;
	readonly res: any;
	constructor(uq: Uq, res?: any) {
		this.uq = uq;
		this.res = res;
	}

	abstract init():Promise<void>;

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
				let importSelect = await import('../select');
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

	protected setIDUi(fieldItem:FieldItem, pickId: () => Promise<any>, render: (values:any) => JSX.Element) {
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
