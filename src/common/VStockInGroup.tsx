import { observer } from "mobx-react";
import React from "react";
import { LMR, VPage } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VStockInGroup extends VPage<CCommon> {
	private closeLevelWhenRemoved: number;
	init(param: number) {
		this.closeLevelWhenRemoved = param;
	}

	header() {return '设置分组'}
	right() {
		return <button className="btn btn-sm btn-info mr-2" onClick={this.controller.manageGroups}>管理分组</button>;
	}
	content() {
		return React.createElement(observer(() => {
			let {stock, cApp, setGroup, setStockToAccount} = this.controller;
			if (!stock) return <div>no stock, can set group</div>;
			let {id:stockId, name, no} = stock;
			let {store} = cApp;
			let {miGroups, miAccounts} = store;
			let {groups} = miGroups;
			let {accounts} = miAccounts;
			let inGroup = store.inAnyGroup(stockId);
			let inAnyAccount = store.inAnyAccount(stockId);
			let del = <button className="btn btn-sm btn-outline-info"
				onClick={e => this.removeMyAll(stock, e.currentTarget)}>删除自选</button>;
			return <div>
				<LMR className="p-3 align-items-center" right={del}>
					<b>{name}</b> 
					<span className="ml-3">{no}</span>
				</LMR>
				<div className="px-3 mt-1 mb-1 text-muted small">分组</div>
				<div className="d-flex flex-wrap py-1 border-top border-bottom bg-white">
					{groups.length === 0 && <small className="px-3 py-2 text-muted">[无分组]</small>}
					{groups.map(v => {
						let {id, name} = v;
						return <label key={id} className="mb-0 w-8c px-3 py-2">
							<input className="mr-1" 
								type="checkbox" 
								defaultChecked={inGroup[id]}
								onChange={evt => setGroup(evt.currentTarget.checked, v)} />
							{name}
						</label>;
					})}
				</div>

				{accounts?.length > 0 && <>
					<div className="px-3 mt-3 mb-1 text-muted small">持仓账户</div>
					<div className="d-flex flex-wrap py-1 border-top border-bottom bg-white">
					{accounts.map(v => {
						let {id, name} = v;
						let inAccount: boolean, everBought: boolean;
						let iaa = inAnyAccount[id];
						if (iaa === undefined) {
							inAccount = false;
							everBought = false;
						}
						else {
							inAccount = iaa[0];
							everBought = iaa[1];
						}
						return <label key={id} className="mb-0 w-8c px-3 py-2">
							<input className="mr-1" 
								type="checkbox"
								disabled={everBought}
								defaultChecked={inAccount}
								onChange={evt => setStockToAccount(evt.currentTarget.checked, v)} />
							{name}
						</label>;
					})}
					</div>
				</>
				}
			</div>;
		}));
	}

	private async removeMyAll(stock: Stock & StockValue, btn: HTMLButtonElement) {
		btn.disabled = true;
		let callbackWhenRemoved = () => {
			this.closePage(this.closeLevelWhenRemoved);
		}
		await this.controller.removeMyAll(stock,  callbackWhenRemoved);
		btn.disabled = false;
	}
}