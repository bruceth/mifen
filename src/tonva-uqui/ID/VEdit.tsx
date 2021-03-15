import { VPage } from "tonva-react";
import { CID } from "./CID";

export class VEdit extends VPage<CID<any>> {
	header() {return  this.controller.editHeader}
	content() {
		let {cFormView, item} = this.controller;
		//let {itemSchema, uiSchema} = midID;
		return <div className="p-3">
			{cFormView.renderForm(item)}
		</div>;
		/*
			<Form fieldLabelSize={2} formData={item}
			schema={itemSchema}
			uiSchema={uiSchema}
			onButtonClick={this.onSubmit} />
		*/
	}
}
