import { observer } from "mobx-react";
import React from "react";
import { MiAccount } from "store";
import { FA, List, LMR, View } from "tonva-react";
import { nFormat1 } from "tool";
import { Account, AccountValue } from "uq-app/uqs/BruceYuMi";
import { CAccount } from "./CAccount";

export class VAccounts extends View<CAccount> {
	render():JSX.Element {
		return React.createElement(observer(() => {
			let {cApp} = this.controller;
			let {miAccounts} = cApp.store;
			let listHeader = (caption:string) => <div className="small text-muted pt-2 pb-1 px-3">{caption}</div>;
			return <>
				{listHeader('持仓')}
				<List items={miAccounts.accounts} item={{render: this.renderAccount, onClick: this.onClickAccount}} />
			</>;
		}));
	}

	private onClickAccount = (item: MiAccount) => {
		this.controller.showAccount(item);
	}

	private renderAccount = (item:Account&AccountValue, index:number):JSX.Element => {
		function renderValue(caption:string, value:number) {
			return <span className="mr-3">
				<small className="text-muted">{caption}: </small>
				{(value??0).toLocaleString(undefined, nFormat1)}
			</span>;
		}
		let {name, mi, market, count} = item;
		let left = <FA name="money" className="text-warning align-self-start mt-3 ml-3" size="lg" fixWidth={true} />;
		let right = <div className="px-2 d-flex align-items-center">
			<FA className="align-" name="angle-right" />
		</div>;
		return <LMR left={left} right={right}>
			<div className="px-3 py-2 bg-white d-block">
			{
				count > 0?
					<>
						<div>
							{name}
							<small className="ml-3 text-danger">{count}</small>
						</div>
						<div className="mt-2">
							{renderValue('总米值', mi)}
							{renderValue('总市值', market)}
						</div>
					</>
					:
					<>
						<div className="pb-2">
							{name}
							<small className="ml-3 text-muted mb-2">空仓</small>
						</div>
					</>
			}
			</div>
		</LMR>;
	}
}
