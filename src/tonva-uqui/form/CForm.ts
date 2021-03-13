import { ButtonSchema, Controller, FieldItem, FieldItems, Schema, UI, UiButton, UiIdItem, UiNumberItem, UiSchema } from "tonva-react";
import { FormProps } from "./FormProps";
import { VForm } from "./VForm";

export class CForm<T> extends Controller {
	protected readonly ui: UI;
	param: T;
	schema: Schema;
	uiSchema: UiSchema;
	label: string;
	submitCaption: string;
	private onSubmit: (values:any) => Promise<void>;

	constructor(props: FormProps, res?:any) {
		super();
		this.setRes(res);
		let {label, fieldArr, fields, onSubmit, submitCaption} = props;
		this.schema = this.buildItemSchema(fieldArr);
		this.uiSchema = this.buildUISchema(fields);
		this.label = label;
		this.submitCaption = submitCaption;
		this.onSubmit = onSubmit;
	}

	protected async internalStart(param: T) {
		this.param = {...param};
		this.openVPage<any, any>(VForm);
	}

	submit(data:any) {
		if (!this.param) this.param = {} as any;
		Object.assign(this.param, data);
		//this.returnCall(param);
		this.onSubmit?.(this.param);
	}

	protected buildItemSchema(fieldArr: FieldItems): Schema {
		let ret:Schema = [];
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
		}
		ret.push({
			name: 'submit',
			type: 'submit',
		} as ButtonSchema);
		return ret;
	}

	protected buildUISchema(fields: {[name:string]:FieldItem}):UiSchema {
		let items = {...fields as any};
		let uiButton: UiButton = {
			label: this.submitCaption ?? '提交',
			className: 'btn btn-primary',
			widget: 'button',
		};
		items['submit'] = uiButton;
		for (let i in fields) {
			let field = fields[i];
			let {type} = field;
			if (type === 'id') {
				let uiId = field as UiIdItem;
				let {pickId} = uiId;
				if (pickId === undefined) {
					let uiNumber = field as UiNumberItem;
					uiNumber.widget = 'number';
					uiNumber.placeholder = 'ID number, only on debugging';
				}
			}
		}
		let ret = {items};
		return ret;
	}
}
