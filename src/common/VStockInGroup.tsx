import { observer } from "mobx-react";
import { group } from "node:console";
import React from "react";
import { LMR, VPage } from "tonva-react";
import { CCommon } from "./CCommon";

export class VStockInGroup extends VPage<CCommon> {
	header() {return '设置分组'}
	right() {
		return <button className="btn btn-sm btn-info mr-2" onClick={this.controller.manageGroups}>管理分组</button>;
	}
	content() {
		return React.createElement(observer(() => {
			let {stock, cApp, setGroup} = this.controller;
			if (!stock) return <div>no stock, can set group</div>;
			let {id:stockId, name, no} = stock;
			let {store} = cApp;
			let {miGroups} = store;
			let {groups} = miGroups;
			let inGroup = store.buildInGroup(stockId);
			let del = <button className="btn btn-sm btn-outline-info align-self-center"
				onClick={() => this.controller.removeMyAll(stock)}>删除自选</button>;
			return <div>
				<LMR className="p-3" right={del}>
					<b>{name}</b> 
					<span className="ml-3">{no}</span>
				</LMR>
				<div className="d-flex flex-wrap py-1 border-top border-bottom">
					{groups.length === 0 && <small className="text-muted">无分组</small>}
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
			</div>;
		}));
	}
}