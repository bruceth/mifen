import { CUqBase } from "UqApp";
import { VGroup } from "./VGroup";

export class CGroup extends CUqBase {
	async internalStart(param: any) {
		this.openVPage(VGroup);
	}
}
