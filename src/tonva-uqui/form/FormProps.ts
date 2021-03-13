import { ChangedHandler, ChangingHandler, FieldItem, FieldItemId, FieldItemString, ID, UI } from "tonva-react";

export class FormProps {
	label: string;
	readonly fieldArr: FieldItem[];
	readonly fields: {[name:string]: FieldItem};
	onSubmit: (values:any) => Promise<void>;
	submitCaption: string;

	constructor(ui: UI, exFields:{[name:string]: Partial<FieldItem>}) {
		let {label, fieldArr, fields} = ui;
		this.label = label;
		this.fieldArr = [];
		this.fields = {};
		for (let i in fields) {
			let field = fields[i];
			let exField = exFields?.[i];
			let index = fieldArr.findIndex(v => v === field);
			let f = {...field, ...exField};
			this.fields[i] = f;
			this.fieldArr[index] = f;
		}
	}

	private setDefaultIDUi(field:FieldItem, FieldID:ID) {
	}

	setIDUi(fieldName:string, pickId: () => Promise<any>, render: (values:any) => JSX.Element) {
		let field = this.fields[fieldName];
		if (field === undefined) {
			alert(`${fieldName} not defined in UI`);
			return;
		}
		if (field.type !== 'id') {
			alert(`${fieldName} is not id UI`);
			return;
		}
		let idField = field as FieldItemId;
		idField.widget = 'id';
		idField.pickId = pickId;
		(idField as any).Templet = render;
	}

	setNO(no:string, fieldName:string = 'no') {
		let field = this.fields[fieldName];
		if (!field) return;
		if (field.type !== 'string') return;
		let noField = field as FieldItemString;
		noField.readOnly = true;
		noField.defaultValue = no;
	}

	hideField(...fieldNames:string[]) {
		for (let fieldName of fieldNames) {
			let index = this.fieldArr.findIndex(v => v.name === fieldName);
			if (index >= 0) this.fieldArr.splice(index, 1);
		}
	}

	setFieldChanged(fieldName: string, onChanged: ChangedHandler) {
		let field = this.fields[fieldName];
		if (field) field.onChanged = onChanged;
	}

	setFieldChanging(fieldName: string, onChanging: ChangingHandler) {
		let field = this.fields[fieldName];
		if (field) field.onChanging = onChanging;
	}
}
