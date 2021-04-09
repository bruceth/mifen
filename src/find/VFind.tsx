import { observer } from "mobx-react";
import React from "react";
import { DropdownAction, DropdownActions, FA, LMR, SearchBox, VPage } from "tonva-react";
import { CFind } from "./CFind";

export class VFind extends VPage<CFind> {
	header() {return '发现'}
	content() {
		let {showA, showHK, showSH, showSZ, showAll, cGroup} = this.controller;
		let buttons:[string, ()=>Promise<void>][] = [
			['A股', showA],
			['港股', showHK],
			['沪A', showSH],
			['深A', showSZ],
			['全部', showAll],
		];
		let renderButton = (caption:string, onClick:()=>void) => <button key={caption} 
			className="btn btn-outline-info m-1" 
			onClick={onClick}>
			{caption}
		</button>;
		return <div className="bg-light">
			<div className="p-3">
				<SearchBox className="mb-0" onSearch={this.controller.onSearch} placeholder="股票代码，名称" />
			</div>
			<div className="p-2 mb-2 d-flex flex-wrap bg-white border-top border-bottom">
				{buttons.map(v => {
					let [caption, show] = v;
					return renderButton(caption, show);
				})}
			</div>

			<div className="mb-3">
				{this.renderMyAll()}
			</div>
			<div className="small text-muted px-3 mb-1">分组</div>
			<div className=" mb-3 px-1 pb-1 bg-white border-top border-bottom">
				{cGroup.renderGroups()}
			</div>
			<div className="small text-muted px-3 mt-2 mb-1">行业</div>
			<div className=" mb-3 px-1 pb-1 bg-white border-top border-bottom">
				{cGroup.renderIndustries()}
			</div>
			<div className="mb-3">
				{this.renderMyBlock()}
			</div>
		</div>
	}

	private renderMyAll() {
		let {cApp, cGroup} = this.controller;
		let {showStocksAll} = cGroup;
		let {stocksMyAll, myAllCaption} = cApp.store;
		return this.renderSpec(stocksMyAll?.length, myAllCaption, 'home', 'text-primary', showStocksAll);
	}

	private renderMyBlock() {
		return React.createElement(observer(() => {
			let {cApp, cGroup} = this.controller;
			let {showStocksBlock} = cGroup;
			let {stocksMyBlock, myBlockCaption} = cApp.store;
			return this.renderSpec(stocksMyBlock?.length, <>
				<span className="mr-3">{myBlockCaption}</span>
				<small className="text-muted">选股时不列出</small>
			</>,
			'ban', 'text-black', showStocksBlock);
		}));
	}

	private renderSpec(count:number, text:string|JSX.Element, icon:string, color:string, click:()=>void) {
		return React.createElement(observer(() => {
			let right = count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>;
			let cn = "align-self-center ml-3 " + color;
			return <div className="mt-2 bg-white cursor-pointer" onClick={click}>
				<LMR left={<FA name={icon} className={cn} size="lg" fixWidth={true} />} right={right}>
					<div className="px-3 py-2">{text}</div>
				</LMR>
			</div>
		}));
	}

	right() {
		return React.createElement(observer(() => {
			let {cCommon} = this.controller.cApp;
			let actions: DropdownAction[] = [
				{
					caption: '管理股票分组',
					action: cCommon.manageGroups,
					icon: 'object-group',
				},
			];
			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}
}
