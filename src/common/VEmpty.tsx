import { VPage } from "tonva-react";
import { CCommon } from "./CCommon";

export class VEmpty extends VPage<CCommon> {
	header() {
		return 'Empty';
	}
	content() {
		return <div>empty</div>;
	}
}