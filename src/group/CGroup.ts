import { CUqBase } from "../uq-app";
import { VGroup } from "./VGroup";

export class CGroup extends CUqBase {
	async internalStart(param: any) {
		this.openVPage(VGroup);
	}
}
