import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, FA, List, LMR, VPage } from "tonva-react";
import { CGroup } from "./CGroup";
import { MiGroup } from "store/miGroup";
import { Account, AccountValue } from "uq-app/uqs/BruceYuMi";
import { MiAccount } from "store/miAccount";

export class VGroups extends VPage<CGroup> {
	header() { return '自选组'; }
	content() {
		return React.createElement(observer(() => {
			let {cApp, showStocksAll, showStocksBlock} = this.controller;
			let {miGroups, miAccounts} = cApp.store;
			let {groups, groupMyAll, groupBlock } = miGroups;
			return <div className="pb-3">
				<List items={miAccounts.accounts} item={{render: this.renderAccount, onClick: this.onClickAccount}} />
				<List items={groups} item={{render: this.renderGroup, onClick:this.controller.showMiGroup}} className="my-3" />
				{this.renderSpec(groupMyAll, groupMyAll.name, 'home', 'text-primary', showStocksAll)}
				{this.renderSpec(groupBlock, <>
						<span className="mr-3">{groupBlock.name}</span>
						<small className="text-muted">选股时不列出</small>
					</>, 			
					'ban', 'text-black', showStocksBlock)}
			</div>;
		}));
	}
	private onClickAccount = (item: MiAccount) => {
		this.controller.showAccount(item);
	}

	private renderAccount = (item:Account&AccountValue, index:number):JSX.Element => {
		function renderValue(caption:string, value:number) {
			return <span className="mr-3"><small className="text-muted">{caption}: </small>{value??0}</span>;
		}
		let {name, mi, market, count} = item;
		let left = <FA name="money" className="text-warning align-self-start mt-3 ml-3" size="lg" fixWidth={true} />;
		let right = <div className="px-2 d-flex align-items-center">
			<FA className="align-" name="angle-right" />
		</div>;
		return <LMR left={left} right={right}>
			<div className="px-3 py-2 bg-white d-block">
				<div>{name}</div>
				<div className="mt-2">
					<span className="mr-3 small">共{count??0}只</span>
					{renderValue('总米值', mi as number)}
					{renderValue('总市值', market as number)}
				</div>
			</div>
		</LMR>;
	}

	private renderGroup = (group:MiGroup, index: number):JSX.Element => {
		let {name, count} = group;
		let left = <FA name="list-alt" className="text-info align-self-center ml-3" size="lg" fixWidth={true} />;
		let right = count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>;
		return <LMR left={left} right={right}>
			<div className="px-3 py-2">{name}</div>
		</LMR>;
	}

	private renderSpec(group:MiGroup, text:string|JSX.Element, icon:string, color:string, click:()=>void) {
		let {count} = group;
		let right = count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>;
		let cn = "align-self-center ml-3 " + color;
		return <div className="mt-2 bg-white cursor-pointer" onClick={click}>
			<LMR left={<FA name={icon} className={cn} size="lg" fixWidth={true} />} right={right}>
				<div className="px-3 py-2">{text}</div>
			</LMR>
		</div>
	}

	right() {
		return React.createElement(observer(() => {
			let {store} = this.controller.cApp;
			let groups = store.miGroups.getMemuItems(this.controller.changeMiGroup);
			let actions: DropdownAction[] = [
				{
					caption: '管理自选组',
					action: this.controller.manageGroups,
					icon: 'object-group',
				},
				undefined,
				...groups,
			];
			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}
}
