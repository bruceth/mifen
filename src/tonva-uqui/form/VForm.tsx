import { Context, Form, VPage } from "tonva-react";
import { CForm } from "./CForm";

export class VForm<C extends CForm<any>> extends VPage<C> {
	header() {return this.controller.label}
	protected get back(): 'close' | 'back' | 'none' {
		return 'close';
	}
	
	content() {
		let {param, schema, uiSchema} = this.controller;
		return <div className="p-3">
			<Form fieldLabelSize={2} formData={param}
				schema={schema}
				uiSchema={uiSchema}
				onButtonClick={this.onSubmit} />
		</div>
	}

	private onSubmit = async (name:string, context: Context) => {
		this.controller.submit(context.data);
	}
}
