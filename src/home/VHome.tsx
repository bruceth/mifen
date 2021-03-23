import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, FA, LMR, VPage } from "tonva-react";
import { CHome } from "./CHome";

export class VHome extends VPage<CHome> {
	header() { return '首页'; }
	content() {
		return React.createElement(observer(() => {
			let {cApp, cAccount, cGroup, showStocksAll, showStocksBlock} = this.controller;
			let {stocksMyAll, stocksMyBlock, myAllCaption, myBlockCaption} = cApp.store;
			return <div className="pb-3">
				{cAccount.renderAccounts()}
				{cGroup.renderGroups()}
				{this.renderSpec(stocksMyAll?.length, myAllCaption, 'home', 'text-primary', showStocksAll)}
				{this.renderSpec(stocksMyBlock?.length, <>
						<span className="mr-3">{myBlockCaption}</span>
						<small className="text-muted">选股时不列出</small>
					</>,
					'ban', 'text-black', showStocksBlock)}
			</div>;
		}));
	}

	right() {
		return React.createElement(observer(() => {
			let {cCommon} = this.controller.cApp;
			let actions: DropdownAction[] = [
				{
					caption: '管理持仓账户',
					action: cCommon.manageAccounts,
					icon: 'money',
				},
				undefined,
				{
					caption: '管理股票分组',
					action: cCommon.manageGroups,
					icon: 'object-group',
				},
			];
			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}

	private renderSpec(count:number, text:string|JSX.Element, icon:string, color:string, click:()=>void) {
		let right = count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>;
		let cn = "align-self-center ml-3 " + color;
		return <div className="mt-2 bg-white cursor-pointer" onClick={click}>
			<LMR left={<FA name={icon} className={cn} size="lg" fixWidth={true} />} right={right}>
				<div className="px-3 py-2">{text}</div>
			</LMR>
		</div>
	}
}
