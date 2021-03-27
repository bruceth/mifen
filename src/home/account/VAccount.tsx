import { observer } from "mobx-react";
import React from "react";
import { DropdownAction, DropdownActions, FA, List, LMR, VPage } from "tonva-react";
import { nFormat0, nFormat1 } from "tool";
import { HoldingStock } from "../../store";
import { CAccount } from "./CAccount";

export class VAccount extends VPage<CAccount> {
	private actionsElement: ChildNode;

	header() {return this.controller.miAccount.name}
	content() {
		return React.createElement(observer(() => {
			function valueToString(value:number, suffix: string = ''):string {
				if (isNaN(value) === true) return '-';
				return (value??0).toLocaleString(undefined, nFormat1) + suffix;
			}
			function renderValue(caption:string, content:string, cn:string = '') {
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
			let {no, name, miValue: mi, market, cash, holdingStocks} = miAccount;

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
						{renderValue('米息', valueToString(mi), 'd-none d-sm-block')}
						{renderValue('米息率', valueToString(mi*100/market, '%'))}
						{renderValue('市值', valueToString(market))}
						{renderCash(cash)}
						{typeof cash === 'number' && renderValue('总值', valueToString(market + cash))}
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

				<div className="small text-muted px-2 px-sm-3 py-1 d-flex">
					<div className="w-6c">持仓市值</div>
					<div className="w-5c text-right ml-auto">持仓</div>
					<div className="w-4c text-right">米息率</div>
					<div className="w-5c text-right">市价/成本价</div>
					<div className="w-5c text-right">盈亏</div>
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

	private f0String(v:number, suffix:string = '') {
		if (v === null || v === undefined || isNaN(v) === true) return '-';
		return v.toLocaleString(undefined, nFormat0) + suffix;
	}

	private f1String(v:number, suffix:string = '') {
		if (v === null || v === undefined || isNaN(v) === true) return '-';
		return v.toLocaleString(undefined, nFormat1) + suffix;
	}

	private hideActionsElement() {
		if (this.actionsElement) {
			(this.actionsElement as HTMLDivElement).className = 'd-none';
			this.actionsElement = undefined;
		}
	}

	private renderHolding = (holding: HoldingStock, index: number) => {
		let {showHolding, showBuy, showSell} = this.controller;
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
		return <div className="d-block">
			<div className={'px-2 px-sm-3 py-2 d-flex cursor-pointer ' + cn}
				onClick={onClick}>
				<div className="w-6c d-flex flex-column">
					<div>{name}</div>
					<div className="">{this.f1String(market)}</div>
				</div>
				<div className="d-flex flex-grow-1 justify-content-end">
					<div className="w-5c text-right">{this.f0String(quantity)}</div>
					<div className="w-4c text-right">{this.f1String(miRate, '%')}</div>
					<div className="w-4c text-right">
						{this.f1String(price)} <br/>
						{this.f1String(cost/quantity)} <br/>
					</div>
					<div className="w-5c text-right">
						{this.f1String(market - cost)} <br/>
						{this.f1String((market - cost)*100/cost, '%')}
					</div>
				</div>
			</div>
			<div className="d-none">
				<div className="d-flex border-top px-2 px-sm-3 py-1 justify-content-end" 
					onClick={()=>this.hideActionsElement()}>
					<button className="btn btn-sm btn-outline-info ml-3"
						onClick={() => showBuy(holding)}>加买</button>
					<button className="btn btn-sm btn-outline-info ml-3"
						onClick={() => showSell(holding)}>卖出</button>
					<button className="btn btn-sm btn-outline-info ml-3 "
						onClick={() => showHolding(holding)}>查看</button>
				</div>
			</div>
		</div>;
	}

/*
	<div className="d-sm-flex flex-wrap justify-content-end">
	{this.renderValue('股数', quantity, nFormat0, '', 'w-min-5c')}
	{this.renderValue('市值', market, nFormat1, '', 'w-min-6c')}
	{this.renderValue('米息率', mi*100/market, nFormat1, '%', 'w-min-4c')}
</div>
*/

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
