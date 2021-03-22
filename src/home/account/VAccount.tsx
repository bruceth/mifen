import { observer } from "mobx-react";
import React from "react";
import { DropdownAction, DropdownActions, FA, List, LMR, VPage } from "tonva-react";
import { formatNumber } from "tool";
import { HoldingStock } from "../../store";
import { CAccount } from "./CAccount";

export class VAccount extends VPage<CAccount> {
	header() {return this.controller.miAccount.name}
	content() {
		return React.createElement(observer(() => {
			function renderValue(caption:string, value:number) {
				return <div className="m-1 border rounded w-min-5c px-1 py-2">
					<small className="text-muted">{caption}</small>
					<div>{formatNumber(value??0)}</div>
				</div>;
			}
			let renderCash = (value:number) => {
				let caption = '现金';
				if (typeof value === 'number') return renderValue(caption, value);
				return <div className="m-1 border rounded w-min-5c px-1 py-2">
					<small className="text-muted">{caption}</small>
					<div className="text-danger small">无期初</div>
				</div>;
			}
			let {miAccount, showBuy, showCashIn, showCashOut, showCashAdjust} = this.controller;
			let {no, name, mi, market, cash, holdingStocks} = miAccount;

			let holdings:HoldingStock[], holdings0:HoldingStock[];
			if (holdingStocks) {
				holdings = [];
				holdings0 = [];
				let len = holdingStocks.length;
				for (let i=0; i<len; i++) {
					let holding = holdingStocks[i];
					if (holding.quantity === 0) holdings0.push(holding);
					else holdings.push(holding);
				}
			}

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
					<div className="my-3 text-center d-flex justify-content-center flex-wrap">
						{renderValue('米值', mi as number)}
						{renderValue('市值', market as number)}
						{renderCash(cash as number)}
						{typeof cash === 'number' && renderValue('总值', (market as number) + (cash as number))}
					</div>
				</div>

				<div className="mb-3 mx-3 d-flex">
					<button className="btn btn-outline-primary mr-3" onClick={() => showBuy()}>买股</button>
					{
						typeof cash === 'number'?
							<DropdownActions className="btn btn-outline-warning"
								containerClass="ml-auto"
								actions={actions} icon="money" content="资金" />
							:
							<button className="btn btn-outline-info ml-auto" onClick={this.controller.showCashInit}>
								<FA name="cog" className="small text-info" /> 设置期初资金
							</button>
					}
				</div>

				<div className="small text-muted px-3 py-1">持仓明细</div>
				<List items={holdings}
					item={{render: this.renderHolding}} />
				{
					holdings0 && holdings0.length > 0 && <>
						<div className="small text-muted px-3 py-1 mt-3">0持仓股票</div>
						<List items={holdings0}
							item={{render: this.renderHolding}} />
					</>
				}
			</div>;
		}));
	}

	private renderHolding = (holding: HoldingStock, index: number) => {
		let {showHolding, showBuy, showSell} = this.controller;
		let {stockObj, quantity, mi, market} = holding;
		let {name, code} = stockObj;
		return <div className="px-3 py-2">
			<div className="d-flex cursor-pointer flex-grow-1"
				 onClick={() => showHolding(holding)}>
				<div className="mr-auto w-min-4c">
					<div className="small text-muted">{code}</div>
					<b>{name}</b> 
				</div>
				<div className="d-flex flex-sm-row flex-wrap justify-content-end">
					{this.renderValue('股数', quantity)}
					{this.renderValue('米值', mi)}
					{this.renderValue('市值', market)}
				</div>
			</div>
			<div className="flex-column flex-sm-row ml-3 ml-sm-5 d-flex w-min-3-5c">
				<button className="btn btn-sm btn-outline-info mb-2 mb-sm-0"
					onClick={() => showBuy(holding)}>加买</button>
				<button className="ml-0 ml-sm-2 btn btn-sm btn-outline-info"
					onClick={() => showSell(holding)}>卖出</button>
			</div>
		</div>;
	}

	private renderValue(caption:string, value: number, dec: number = 0) {
		return <div className="text-right ml-3 ml-sm-5 w-min-3c">
			<div className="small text-muted">{caption}</div>
			<div>{value?.toFixed(dec)}</div>
		</div>;
	}
}
