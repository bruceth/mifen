import { MGroup } from "store/mGroup";
import { VGroups } from './VGroups';

export class VRootIndustry extends VGroups {
	protected onGroupClick(group: MGroup) {
		this.controller.showRootIndustry(group);
	}
}
