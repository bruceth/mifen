import { observer } from "mobx-react";
import React from "react";
import { List, Scroller, VPage } from "tonva-react";
import { renderStockRow } from "tool";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CFind } from "./CFind";

export class VStocksPage extends VPage<CFind> {
	header() {return React.createElement(observer(() => <span className="">{this.controller.header}</span>))}
	content() {
		let { pageStocks, onClickStock } = this.controller;
		return <List items={pageStocks} item={{render: this.renderStock, onClick: onClickStock}} />
	}
	private renderStock = (stock: Stock & StockValue): JSX.Element => {
	/*
		let isSelected = this.controller.isMySelect(stock);
		let setStock = isSelected === true? 
			<DropdownActions actions={[
				{
					caption: '修改分组',
					action: () => this.controller.setStockToGroup(stock),
				},
				{
					caption: '删除自选',
					action: () => this.controller.removeMySelect(stock),
				},
				undefined,
				{
					caption: '取消操作',
					action: () => {},
				}
			]} icon="cog" content="设自选" className="cursor-pointer dropdown-toggle btn btn-sm btn-outline-info" />
			:
			<button className="btn btn-sm btn-outline-primary" 
				onClick={() => this.controller.selectStock(stock)}>
				<FA name="plus-square-o" className="small" /> 加自选
			</button>;
		*/
		let pinStock = this.controller.cApp.cHome.renderPinStock(stock);
		return renderStockRow(1, stock, this.onClickName, undefined, pinStock);
	}

	private onClickName = (stock: Stock & StockValue) => {
		this.controller.cApp.openStock(stock);
	}

	protected async onPageScrollBottom(scroller: Scroller): Promise<void> {
		await this.controller.pageStocks.more();
	}
}
/*
<button className="btn btn-sm btn-outline-primary" 
onClick={() => this.controller.selectStock(stock)}>
<FA name="cog" className="text-warning small" /> 设自选
</button>
*/