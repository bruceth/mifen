import { VPage } from "tonva-react";
import { CIDEdit } from "./CIDEdit";

export class VIDEdit extends VPage<CIDEdit<any>> {
	header() {
		let {ID} = this.controller.props;
		return ID.t(ID.sName);
	}
	content() {
		let {cFormView, item} = this.controller;
		//let {IDUI} = midID;
		return <div className="p-3">
			{cFormView.renderForm(item)}
		</div>;
	}
}
