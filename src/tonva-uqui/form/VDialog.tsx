import { CDialog } from "./CDialog";
import { VForm } from "./VForm";

export class VDialog extends VForm<CDialog<any>> {
	protected afterBack():void {
		this.controller.close();
	}
}
