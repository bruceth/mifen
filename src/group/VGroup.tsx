import { VPage } from "tonva-react";
import { CGroup } from "./CGroup";

export class VGroup extends VPage<CGroup> {
	header() {return '自选组管理'}
	content() {
		return <div className="p-3">
			自选组管理
		</div>;
	}
}