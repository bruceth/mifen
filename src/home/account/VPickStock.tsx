import React from "react";
import { observer } from "mobx-react";
import { List, SearchBox, VPage } from "tonva-react";
import { renderStockName } from "tool";
import { Stock } from "uq-app/uqs/BruceYuMi";
import { CAccount } from "./CAccount";

export class VPickStock extends VPage<CAccount> {
	header() {return '选择股票'}
	right() {
		return <SearchBox 
			className="mr-2"
			onSearch={this.controller.onSearchStock} 
			placeholder="股票名称或代码" />;
	}
	content() {
		return React.createElement(observer(() => {
			return <div>
				<List items={this.controller.stocks} item={{render: this.renderStock, onClick: this.onClickStock}} />
			</div>;
		}));
	}

	private renderStock = (stock: Stock, index: number): JSX.Element => {
		return <div className="px-3 py-2">
			{renderStockName(undefined, stock)}
		</div>;
	}

	private onClickStock = (stock: Stock) => {
		this.returnCall(stock);
		this.closePage();
	}
}
