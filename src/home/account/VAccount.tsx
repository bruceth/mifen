import { observer } from "mobx-react";
import React from "react";
import scrollIntoView from 'scroll-into-view-if-needed';
import { DropdownAction, DropdownActions, FA, List, LMR, VPage } from "tonva-react";
import { NFormat, nFormat0, nFormat1, nFormat2, smallPercent } from "tool";
import { HoldingStock } from "../../store";
import { CAccount } from "./CAccount";

export class VAccount extends VPage<CAccount> {
	private actionsElement: ChildNode;
	private renderPageRight: () => JSX.Element;
	init(param: {
		renderPageRight: () => JSX.Element;
	}) {
		let {renderPageRight} = param;
		this.renderPageRight = renderPageRight;
	}

	header() {
		return React.createElement(observer(() => <>{this.controller.miAccount.name}</>));
	}
	right() {return this.renderPageRight?.()}
	content() {
		return React.createElement(observer(() => {
			function valueToString(value:number, suffix: string|JSX.Element = undefined):JSX.Element {
				if (isNaN(value) === true) return <>-</>;
				return <>{(value??0).toLocaleString(undefined, nFormat1)}{suffix}</>;
			}
			function renderValue(caption:string, content:string|JSX.Element, cn:string = '') {
				return <div className={'my-1 mx-1 mx-sm-2 border rounded w-min-5c px-1 px-sm-2 py-2 ' + cn}>
					<small className="text-muted">{caption}</small>
					<div>{content}</div>
				</div>;
			}
			let renderCash = (value:number) => {
				let caption = '现金';
				if (typeof value === 'number') return renderValue(caption, valueToString(value));
				return <div className="my-1 mx-1 mx-sm-2 border rounded w-min-5c px-1 px-sm-2 py-2">
					<small className="text-muted">{caption}</small>
					<div className="text-danger small mt-1">[无]</div>
				</div>;
			}
			let {miAccount, showBuy, showCashIn, showCashOut, showCashAdjust} = this.controller;
			let {no, name, miValue, market, cash, holdingStocks, portion, portionAmount, buyableCount} = miAccount;

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
			return <div className="pb-3">
				<div className="mb-3 px-3 py-2 bg-white">
					<LMR right={<small className="text-muted">组合编号: {no}</small>}>
						{name}
					</LMR>
					<div className="my-3 text-center d-flex justify-content-center flex-wrap">
						{renderValue('米息率', valueToString(miValue*100/market, smallPercent))}
						{renderValue('市值', valueToString(market))}
						{renderCash(cash)}
						{renderValue('米息', valueToString(miValue), 'd-none d-sm-block')}
						{cash > 0 && renderValue('总值', valueToString(market + cash), 'd-none d-sm-block')}
					</div>
					<ul className="small text-muted mb-0">
					{
						cash?
						portionAmount &&
						<>
							<li>
								<small className="">份数:</small> {portion} &nbsp; 
								<small className="">份额:</small> <span className="text-danger">{portionAmount}</span> &nbsp; 
								{
									buyableCount > 0?
									<><small className="">可加</small>{buyableCount}只</>
									:
									<> &nbsp; <small className="text-danger">已超</small>{-buyableCount}只</>
								}
							</li>
							<li className="">
								<small className="text-info">保持分散，单只股票不超资金份额</small>
							</li>
						</>
						:
						<li className="">设置资金后，会根据分散要求，提供股数建议</li>
					}
					</ul>
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
								<FA name="cog" className="small text-info" /> 初始资金
							</button>
					}
				</div>

				<div className="px-2 px-sm-3 py-1 container">
					<div className="small text-muted row mx-0">
						<div className="col-3 px-0">持仓市值</div>
						<div className="col px-0 text-right">持仓</div>
						<div className="col px-0 text-right">米息率</div>
						<div className="col px-0 text-right">
							市价<br/>
							成本价
						</div>
						<div className="col px-0 text-right">
							盈亏<br/>
							比例
						</div>
					</div>
				</div>
				<List items={holdings}
					item={{render: this.renderHolding}} />
				{
					holdings0 && holdings0.length > 0 && <>
						<div className="small text-muted px-3 py-1 mt-3">已清仓</div>
						<List items={holdings0}
							item={{render: this.renderHolding}} />
					</>
				}
			</div>;
		}));
	}

	private fString(v:number, nFormat:NFormat, suffix:string|JSX.Element = ''):string|JSX.Element {
		if (v === null || v === undefined || isNaN(v) === true) return '-';
		return <>{v.toLocaleString(undefined, nFormat)}{suffix}</>;
	}

	private hideActionsElement() {
		if (this.actionsElement) {
			(this.actionsElement as HTMLDivElement).className = 'd-none';
			this.actionsElement = undefined;
		}
	}

	private renderHolding = (holding: HoldingStock, index: number) => {
		let {showHolding, showBuy, showSell, showChangeCost, showTransactionDetail, miAccount} = this.controller;
		let {portionAmount, cash} = miAccount;
		let {stockObj, quantity, market, cost} = holding;
		let {name} = stockObj;
		let onClick = (evt: React.MouseEvent) => {
			if (this.actionsElement) {
				(this.actionsElement as HTMLDivElement).className = 'd-none';
			}
			let actionsElement = evt.currentTarget.nextSibling;
			if (actionsElement !== this.actionsElement) {
				this.actionsElement = actionsElement;
				(this.actionsElement as HTMLDivElement).className = 'd-block';
				scrollIntoView(this.actionsElement as HTMLDivElement, { scrollMode: 'if-needed', behavior: 'smooth' });
			}
			else {
				this.actionsElement = undefined;
			}
		}
		let {miRate, price} = stockObj;
		let cn: string;
		if (cost>market) {
			cn = 'text-success';
		}
		else if (cost<market) {
			cn = 'text-danger';
		}
		else {
			cn = '';
		}
		let vBuyable: any;
		if (cash) {
			let buyable: number;
			if (market < portionAmount * 0.9) {
				if (quantity > 0) {
					buyable = Math.round((portionAmount - market) / price);
					if (buyable > 0) {
						vBuyable = <>{buyable} <FA name="arrow-circle-up" className="text-info" /></>;
					}
				}
			}
			else if (market > portionAmount * 1.1) {
				buyable = Math.round((market - portionAmount) / price);
				if (buyable > 0) {
					vBuyable = <>{buyable} <FA name="arrow-circle-down" className="text-muted" /></>;
				}
			}
			else {
				vBuyable = <><FA name="check-circle-o" className="text-warning" /></>;
			}
		}
		return <div className="d-block px-2 px-sm-3 py-1 container">
			<div className={'row mx-0 cursor-pointer ' + cn}
				onClick={onClick}>
				<div className="col-3 px-0">
					<div>{name}</div>
					<div className="">{this.fString(market, nFormat1)}</div>
				</div>
				<div className="col px-0 text-right">
					<div>{this.fString(quantity, nFormat0)}</div>
					<div className="small">{vBuyable}</div>
				</div>
				<div className="col px-0 text-right">{this.fString(miRate, nFormat1, smallPercent)}</div>
				<div className="col px-0 text-right">
					<div className="text-right">{this.fString(price, nFormat2)}</div>
					<div className="text-right small">{this.fString(cost/quantity, nFormat2)}</div>
				</div>
				<div className="col px-0 text-right">
					<div className="text-right">{this.fString((market - cost)*100/cost, nFormat1, smallPercent)}</div>
					<div className="text-right small">{this.fString(market - cost, nFormat1)}</div>
				</div>
			</div>
			<div className="d-none">
				<div className="d-flex mt-2 px-2 pt-2 pb-1 align-items-center border-top" 
					onClick={()=>this.hideActionsElement()}>
					<button className="btn btn-sm btn-outline-info mr-3 "
						onClick={() => showBuy(holding)}>买入</button>
					<button className="btn btn-sm btn-outline-info mr-3 "
						onClick={() => showSell(holding)}>卖出</button>
					<button className="btn btn-sm btn-link ml-auto "
						onClick={() => showChangeCost(holding)}>改成本</button>
					<button className="btn btn-sm btn-link ml-3 "
						onClick={() => showTransactionDetail(holding)}>明细</button>
					<button className="btn btn-sm btn-link ml-3 "
						onClick={() => showHolding(holding)}>分析</button>
				</div>
			</div>
		</div>;
	}

	private renderValue(caption:string, value: number, format: Intl.NumberFormatOptions, suffix:string, cn: string) {
		return <>
			<div className={'text-right pl-2 d-block d-sm-none'}>
				<div className="d-inline-block small text-muted">{caption}:&nbsp;</div>
				<div className={'d-inline-block w-min-6c'}>{value?.toLocaleString(undefined, format)}{suffix}</div>
			</div>
			<div className={'text-right pl-3 d-sm-block d-none ' + cn}>
				<div className="small text-muted">{caption}</div>
				<div>{value?.toLocaleString(undefined, format)}{suffix}</div>
			</div>
		</>;
	}
}
