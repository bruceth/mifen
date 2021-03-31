import { observer } from "mobx-react";
import React from "react";
import { FA, View } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VPinStock extends View<CCommon> {
	render(stock: Stock & StockValue):JSX.Element {
		return React.createElement(observer(() => {
			let isSelected = this.controller.isMyAll(stock);
			if (isSelected === true) {
				/*
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
				]} icon="cog" content="分组"
				className="cursor-pointer btn btn-sm btn-outline-info align-self-start" />;
				*/
				return <button className="btn btn-sm btn-outline-info align-self-start" 
					onClick={() => this.controller.setStockToGroup(stock)}>
					<FA name="cog" className="small mr-1" fixWidth={true} />分组
				</button>;
			}
			else {
				return <button className="btn btn-sm btn-outline-primary align-self-start" 
					onClick={() => this.controller.toggleMyAll(stock)}>
					<FA name="plus" className="small mr-1" fixWidth={true} />自选
				</button>;
			}	
		}));
	}
}
