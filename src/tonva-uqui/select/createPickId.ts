import { ID, Uq } from "tonva-react";
import { CIDSelect,MidIDSelectList } from "./CIDSelect";

export function createPickId(uq: Uq, ID: ID): () => Promise<any> {
	async function pickId() {
		let mid: MidIDSelectList<any> = new MidIDSelectList(uq, ID);
		let cIDSelect = new CIDSelectInPickId(mid);
		return cIDSelect.call();
	}
	return pickId;
}

export class CIDSelectInPickId extends CIDSelect<any, MidIDSelectList<any>> {
	constructor(mid: MidIDSelectList<any>) {
		super(mid);
		mid.onSelectChange = this.onSelectChange;
	}

	private onSelectChange = (item:any, isSelected:boolean) => {
		this.closePage();
		this.returnCall(item);
	}
}
