import React from "react";
import { observer } from "mobx-react";
import { List, VPage } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { renderStockRow } from "tool";
import { CGroup } from "./CGroup";
import { VRootIndustry } from "./VRootIndustry";

export class VStockList extends VPage<CGroup> {
	private renderRowRight: (stock: Stock & StockValue) => JSX.Element;
	private renderPageRight: () => JSX.Element;
	init(param: {
		renderRowRight: (stock: Stock & StockValue) => JSX.Element;
		renderPageRight: () => JSX.Element;
	}) {
		let {renderRowRight, renderPageRight} = param;
		this.renderRowRight = renderRowRight;
		this.renderPageRight = renderPageRight;
	}

	header() {
		return React.createElement(observer(() => <>{this.controller.listCaption}</>));
	}
	right(): JSX.Element {
		return this.renderPageRight?.();
	}
	content() {
		return React.createElement(observer(() => {
			let {miGroup, stocks} = this.controller;
			let vGroups: any;
			if (miGroup) {
				let {groups} = miGroup;
				if (groups) {
					vGroups = this.renderVm(VRootIndustry, groups);
				}
			}
			return <div>
				{vGroups}
				<List items={stocks} item={{render: this.renderStock}} />
			</div>;
		}));
	}

	private onClickName = (stock:Stock) => {
		this.controller.onStockClick(stock);
	}

	private renderStock = (stock:Stock & StockValue, index:number) => {
		let right = this.renderRowRight?.(stock);
		let {$order} = stock as unknown as any;
		return renderStockRow($order, stock as Stock & StockValue, this.onClickName, right);
	}
}
