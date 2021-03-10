import { LMR, VPage } from "tonva-react";
import { CHolding } from "./CHolding";

export class VAccount extends VPage<CHolding> {
	header() {return this.controller.account.name}
	content() {
		function renderValue(caption:string, value:number) {
			return <span className="mr-3"><small className="text-muted">{caption}: </small>{value??0}</span>;
		}
		let {no, name, mi, market, count} = this.controller.account;
		return <div className="mt-3 px-3 py-2 bg-white d-block">
			<LMR right={<small className="text-muted">组合编号: {no}</small>}>
				{name}
			</LMR>
			<div className="mt-2">
				<span className="mr-3 small">共{count??0}只</span>
				{renderValue('总米值', mi as number)}
				{renderValue('总市值', market as number)}
			</div>
		</div>;
	}
}
