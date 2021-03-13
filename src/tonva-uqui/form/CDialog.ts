//import { ButtonSchema, FieldItem, FieldItems, Schema, UI, UiButton, UiIdItem, UiNumberItem, UiSchema } from "tonva-react";
import { CForm } from "./CForm";
import { VDialog } from "./VDialog";

export class CDialog<T> extends CForm<T> {
	protected async internalStart(param: T) {
		this.param = param;
		this.openVPage(VDialog)
	}

	close() {
		this.returnCall(null);
	}

	submit(data:any) {
		let param:any;
		if (!param) param = {};
		else param = this.param;
		Object.assign(param, data);
		this.returnCall(param);
		this.closePage();
	}
}
