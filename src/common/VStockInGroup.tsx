import { observer } from "mobx-react";
import React from "react";
import { VPage } from "tonva-react";
import { CCommon } from "./CCommon";

export class VStockInGroup extends VPage<CCommon> {
	header() {return '设置分组'}
	right() {
		return <button className="btn btn-sm btn-info mr-2" onClick={this.controller.manageGroups}>管理分组</button>;
	}
	content() {
		return React.createElement(observer(() => {
			let {stock, cApp, setGroup, setMyAll, setBlock} = this.controller;
			if (!stock) return <div>no stock, can set group</div>;
			let {id:stockId, name, code} = stock;
			let {store} = cApp;
			let {miGroups, myAllCaption, myBlockCaption} = store;
			let {groups} = miGroups;
			let inGroup = store.buildInGroup(stockId);
			return <div>
				<div className="p-3">
					<b>{name}</b> 
					<span className="ml-3">{code}</span>
				</div>
				<div className="d-flex flex-wrap py-1 border-top border-bottom">
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
				<div className="mt-2">
					<label className="mb-0 w-8c px-3 py-2">
						<input className="mr-1" type="checkbox"
							disabled={true}
							defaultChecked={true}
							onChange={evt => setMyAll(evt.currentTarget.checked)} />
						{myAllCaption}
					</label>
				</div>
				<div className="mt-2">
					<label className="mb-0 w-8c px-3 py-2">
						<input className="mr-1" type="checkbox"
							onChange={evt => setBlock(evt.currentTarget.checked)} />
						{myBlockCaption}
					</label>
					<small className="text-muted">选股时不列出</small>
				</div>
			</div>;
		}));
	}
}