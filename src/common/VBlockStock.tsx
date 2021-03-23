import { observer } from "mobx-react";
import React from "react";
import { View } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VBlockStock extends View<CCommon> {
	render(stock: Stock & StockValue):JSX.Element {
		return React.createElement(observer(() => {
			let isBlock = this.controller.isMyBlock(stock);
			let cn:string, content:string;
			if (isBlock === true) {
				content = '取消拉黑';
				cn = 'btn-outline-danger';
			}
			else {
				content = '拉黑';
				cn = 'btn-outline-secondary';
			}
			return <button className={'btn btn-sm ' + cn}
				onClick={() => this.controller.toggleBlock(stock)}>
				{content}
			</button>;
		}));
	}
}
