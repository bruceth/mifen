import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, List, VPage } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { renderStockRow } from "tool";
import { CGroup } from "./CGroup";

export class VStockList extends VPage<CGroup> {
	private renderRowRight: (stock: Stock & StockValue) => JSX.Element;
	init(renderRowRight: (stock: Stock & StockValue) => JSX.Element) {
		this.renderRowRight = renderRowRight;
	}

	header() {
		return this.controller.listCaption;
	}
	content() {
		return React.createElement(observer(() => {
			let {stocks} = this.controller;
			return <div>
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

	right(): JSX.Element {
		return null;
	}
}