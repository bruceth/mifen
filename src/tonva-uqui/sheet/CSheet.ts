import { makeObservable, observable } from "mobx";
import { Controller } from "tonva-react";
import { createPickId } from "../select";
import { CForm, FormProps } from "../form";
import { Detail, Master } from "../base";
import { MidSheet } from "./MidSheet";

export abstract class CSheet<M extends Master, D extends Detail> extends Controller {
	readonly midSheet: MidSheet<M, D>;
	id: number;
	master: M = null;
	details: D[] = [];
	detail: D = null;

	constructor(mid: MidSheet<M, D>) {
		super();
		makeObservable(this, {
			master: observable,
			details: observable,
		});
		this.setRes(mid.res);
		this.midSheet = mid;
	}

	protected async load(id:number) {
		this.id = id;
		let [master, details] = await this.midSheet.load(id);
		this.master = master[0];
		this.details = details;
	}

	async saveSheet() {
		let ret = await this.midSheet.save(this.master, this.details);
		return ret;
	}
	
	afterMasterNew() {

	}

	private serial:number = 1;
	editDetail = async (detail: D) => {
		let {uq, detail:detailFormUI} = this.midSheet;
		let {ID, fieldItems} = detailFormUI;
		let uiForm = new FormProps(ID.ui, fieldItems);
		if (fieldItems) {
			for (let i in fieldItems) {
				let field = fieldItems[i];
				let {ID} = field;
				if (ID) {
					uiForm.setIDUi(i, createPickId(uq, ID), ID.render);
				}
			}
		}
		uiForm.hideField('master', 'row');
		uiForm.onSubmit = async (values) => {
			let serial = values['#'];
			if (!serial) {
				values['#'] = this.serial++;
				this.details.push(values);
			}
			else {
				let index = this.details.findIndex(v => (v as any)['#'] === serial);
				if (index >= 0) {
					Object.assign(this.details[index], values);
				}
			}
			this.closePage();
			if (detail === undefined) {
				let cForm = new CForm(uiForm);
				await cForm.start(detail);
			}
		}
		let cForm = new CForm(uiForm);
		await cForm.start(detail);
	}
}
