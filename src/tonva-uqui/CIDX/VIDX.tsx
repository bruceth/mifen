import { VPage } from "tonva-react";
import { CIDX } from "./CIDX";

export class VIDX extends VPage<CIDX<any>> {
	header() {return 'VIDX'};
	content() {
		return <div>
			IDX
		</div>
	}
}