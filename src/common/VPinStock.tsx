import { observer } from "mobx-react";
import React from "react";
import { DropdownActions, FA, View } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VPinStock extends View<CCommon> {
	render(stock: Stock & StockValue):JSX.Element {
		return React.createElement(observer(() => {
			let isSelected = this.controller.isMyAll(stock);
			if (isSelected === true) {
				return <DropdownActions actions={[
					{
						caption: '修改分组',
						action: () => this.controller.setStockToGroup(stock),
					},
					{
						caption: '删除自选',
						action: () => this.controller.removeMyAll(stock),
					},
					undefined,
					{
						caption: '取消操作',
						action: () => {},
					}
				]} icon="cog" content="设自选" 
				className="cursor-pointer dropdown-toggle btn btn-sm btn-outline-info align-self-start" />
			}
			else {
				return <button className="btn btn-sm btn-outline-primary align-self-start" 
					onClick={() => this.controller.toggleMyAll(stock)}>
					<FA name="plus-square-o" className="small" /> 加自选
				</button>;
			}	
		}));
	}
}
