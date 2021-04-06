import { QueryPager, Uq, User } from "tonva-react";
import { CRoles } from "tonva-uqui";
import { CApp, CUqBase } from "../uq-app";
import { VAbout } from "./VAbout";
import { VEditMe } from "./VEditMe";
import { VFaq } from "./VFaq";
import { VMe } from "./VMe";

export interface RootUnitItem {
	id: number;					// root unit id
	owner: any;
	name: string;				// 唯一
	content: string;
	tonvaUnit: number;			// 跟tonva机构对应的值
	x: number;
}

export class CMe extends CUqBase {
	private uq: Uq;
	role: number;
	unitOwner: User;
	rootUnits: QueryPager<any>;
	roles: string[] = null;

	constructor(cApp: CApp) {
		super(cApp);
		this.uq = this.uqs.BruceYuMi;
	}

    protected async internalStart() {
	}

	tab = () => this.renderView(VMe);

	load = async () => {
		this.roles = await this.getUqRoles(this.uq.$.name);
	}

	showEditMe = async () => {
		this.role = undefined; // result.ret[0]?.role;
		this.openVPage(VEditMe);
	}

	backend = async () => {
		let cRoles = new CRoles(this.uq);
		await cRoles.start();
	}

	showFaq = () => {
		this.openVPage(VFaq);
	}

	showAbout = () => {
		this.openVPage(VAbout);
	}
}
