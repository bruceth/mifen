import { FA, List, LMR, VPage } from "tonva-react";
import { CHolding } from "./CHolding";
import { Account, AccountValue } from "UqApp/uqs/BruceYuMi";

export class VHolding extends VPage<CHolding> {
	header() {return <span className="ml-3">持仓组合 <small className="text-muted">正在设计实现中...</small></span>}
	content() {
		return <div>
			<List items={this.controller.accounts} item={{render: this.renderAccount, onClick: this.onClickAccount}} />
		</div>;
	}

	private renderAccount = (item:Account&AccountValue, index:number):JSX.Element => {
		function renderValue(caption:string, value:number) {
			return <span className="mr-3"><small className="text-muted">{caption}: </small>{value??0}</span>;
		}
		let {name, mi, market, count} = item;
		let right = <div className="px-2 d-flex align-items-center">
			<FA className="align-" name="angle-right" />
		</div>;
		return <LMR right={right}>
			<div className="px-3 py-2 bg-white d-block">
				<div>{name}</div>
				<div className="mt-2">
					<span className="mr-3 small">共{count??0}只</span>
					{renderValue('总米值', mi as number)}
					{renderValue('总市值', market as number)}
				</div>
			</div>
		</LMR>;
	}

	private onClickAccount = (item:Account&AccountValue) => {
		this.controller.showAccount(item);
	}
}