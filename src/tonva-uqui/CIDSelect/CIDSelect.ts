import { IDBase } from "../base";
import { CIDList } from "../CIDList";
import { VIDSelect } from "./VIDSelect";

export class CIDSelect<T extends IDBase> extends CIDList<T> {
	protected async internalStart() {
		await this.pageItems.first({});
		this.openVPage(VIDSelect);
	}

	onClickItem = async (item:any) => {
		this.returnCall(item);
	}
}
