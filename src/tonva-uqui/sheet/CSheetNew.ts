import { createPickId } from "../select";
import { Detail, Master } from "../base";
import { CDialog, FormProps } from "../form";
import { CSheet } from "./CSheet";
import { VSheetEdit } from "./VSheetEdit";

export class CSheetNew<M extends Master, D extends Detail> extends CSheet<M, D> {
	protected async internalStart() {
		let {uq, master:masterUI} = this.midSheet;
		let {ID, fieldItems} = masterUI;
		let formProps = new FormProps(ID.ui, fieldItems);
		if (formProps.fields['no']) {
			
			let no = await ID.NO();
			formProps.setNO(no, 'no');
		}
		if (fieldItems) {
			for (let i in fieldItems) {
				let field = fieldItems[i];
				let {ID} = field;
				if (ID) {
					formProps.setIDUi(i, createPickId(uq, ID), ID.render);
				}
			}
		}
		let cDialog = new CDialog(formProps);
		let master = await cDialog.call<M>();
		if (master === null) return;
		this.master = master;
		this.openVPage(VSheetEdit);
	}
}
