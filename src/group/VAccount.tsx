import { observer } from "mobx-react";
import React from "react";
import { HoldingStock } from "store/miAccount";
import { DropdownAction, DropdownActions, List, LMR, VPage } from "tonva-react";
import { CGroup } from "./CGroup";

export class VAccount extends VPage<CGroup> {
	header() {return this.controller.miAccount.name}
	content() {
		return React.createElement(observer(() => {
			function renderValue(caption:string, value:number) {
				return <span className="mr-3"><small className="text-muted">{caption}: </small>{value??0}</span>;
			}
			let {miAccount, showBuy, showCashIn, showCashOut, showCashAdjust} = this.controller;
			let {no, name, mi, market, cash, stockHoldings} = miAccount;
			let actions: DropdownAction[] = [
				{ caption: '调入资金', action: showCashIn, icon: 'sign-in' },
				{ caption: '调出资金', action: showCashOut, icon: 'sign-out' },
				{ caption: '调整资金', action: showCashAdjust, icon: 'adjust' },
			];
			return <div>
				<div className="mb-3 px-3 py-2 bg-white">
					<LMR right={<small className="text-muted">组合编号: {no}</small>}>
						{name}
					</LMR>
					<div className="my-2">
						{renderValue('总米值', mi as number)}
						{renderValue('股票市值', market as number)}
						{renderValue('现金', cash as number)}
					</div>
				</div>

				<div className="mb-3 mx-3 d-flex">
					<button className="btn btn-outline-primary mr-3" onClick={() => showBuy()}>买股</button>
					<DropdownActions className="btn btn-outline-warning"
						containerClass="ml-auto"
						actions={actions} icon="money" content="资金" />
				</div>

				<div className="small text-muted px-3 py-1">持仓明细</div>
				<List items={stockHoldings}
					item={{render: this.renderHolding}} />
			</div>;
		}));
	}

	private renderHolding = (holding: HoldingStock, index: number) => {
		let {showHolding, showBuy, showSell} = this.controller;
		let {stockObj, quantity} = holding;
		let {name, code, miRate, price} = stockObj;
		return <div className="px-3 py-2">
			<div className="d-flex cursor-pointer flex-grow-1"
				 onClick={() => showHolding(holding)}>
				<div className="mr-auto">
					<div className="small text-muted">{code}</div>
					<b>{name}</b> 
				</div>
				<div className="d-flex flex-sm-row flex-wrap">
					{this.renderValue('股数', quantity)}
					{this.renderValue('米值', quantity * miRate, 2)}
					{this.renderValue('市值', quantity * (price as number), 2)}
				</div>
			</div>
			<div className="flex-column flex-sm-row ml-5 d-flex">
				<button className="btn btn-sm btn-outline-info mb-2 mb-sm-0"
					onClick={() => showBuy(holding)}>加买</button>
				<button className="ml-0 ml-sm-2 btn btn-sm btn-outline-info"
					onClick={() => showSell(holding)}>卖出</button>
			</div>
		</div>;
	}

	private renderValue(caption:string, value: number, dec: number = 0) {
		return <div className="text-right ml-3 ml-sm-5">
			<div className="small text-muted">{caption}</div>
			<div>{value.toFixed(dec)}</div>
		</div>;
	}
}
