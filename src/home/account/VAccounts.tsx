import { observer } from "mobx-react";
import React from "react";
import { MiAccount } from "store";
import { FA, List, LMR, View } from "tonva-react";
import { nFormat1, smallPercent } from "tool";
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
		function valueToString(value:number, suffix?:string|JSX.Element):JSX.Element {
			return <>{(value??0).toLocaleString(undefined, nFormat1)}{suffix}</>
		}
		function renderValue(caption:string, content:JSX.Element, cn:string='') {
			return <div className={'pr-3 ' + cn}>
				<small className="text-muted">{caption}: </small>
				{content}
			</div>;
		}
		let {name, miValue, market, count} = item;
		let miRate = market > 1? miValue*100/market : 0;
		let left = <FA name="money" className="text-warning align-self-start mt-3 ml-2 ml-sm-3" size="lg" fixWidth={true} />;
		let right = <div className="px-2 d-flex align-items-center">
			<FA className="align-" name="angle-right" />
		</div>;
		return <LMR left={left} right={right}>
			<div className="px-2 px-sm-3 py-2 bg-white d-block">
			{
				count > 0?
					<>
						<div>
							{name}
							<small className="ml-3 text-danger">{count}</small>
						</div>
						<div className="mt-2 d-flex">
							{renderValue('米息率', valueToString(miRate, smallPercent), 'w-min-8c')}
							{renderValue('米息', valueToString(miValue), 'd-none d-sm-block w-min-8c')}
							{renderValue('市值', valueToString(market))}
						</div>
					</>
					:
					<>
						<div className="py-1">
							{name}
						</div>
					</>
			}
			</div>
		</LMR>;
	}
}
