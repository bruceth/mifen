import { FA, View } from "tonva-react";
import { CXIList } from "./CXIList";

export class VIXRight extends View<CXIList<any, any>> {
	render(item: any) {
		return <button className="btn btn-sm btn-light" onClick={() => this.controller.breakChain(item)}>
			<FA name="chain-broken" />
		</button>;
	}
}