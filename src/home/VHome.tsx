/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, LMR, FA, Scroller, DropdownActions, DropdownAction, t } from 'tonva-react';
import { NStockInfo } from '../stockinfo';
import { CHome } from './CHome';
import { renderSortHeaders, renderStockInfoRow, renderStockUrl } from '../tool';
import { EnumGroupType } from 'uq-app/uqs/BruceYuMi';

export class VHome extends VPage<CHome> {
	header() {
		return React.createElement(observer(() => {
			return <span className="ml-3">首页 - {this.controller.stockGroup.name}</span>;
		}));
	}
	right() {
		return React.createElement(observer(() => {
			let {store, uqs} = this.controller;
			let stockGroups = store.stockGroups.groups.map(v => {
				let {name} = v;
				return {
					caption: name,
					action: () => this.controller.changeGroup(v),
					icon: 'circle-o',
				};
			});
			let {BruceYuMi} = uqs;
			let {Group} = BruceYuMi;
			let groups = store.miGroups.groups.map(v => {
				let {name, type} = v;
				let icon = 'list-alt', iconClass:string = undefined;
				switch (type) {
					case EnumGroupType.all:
						icon = 'home';
						iconClass = 'text-primary'
						break;
					case EnumGroupType.black:
						icon = 'ban';
						iconClass = 'text-black';
						break;
				}
				return {
					caption: Group.t(name) as string,
					action: () => this.controller.changeMiGroup(v),
					icon,
					iconClass,
				};
			});
			let actions: DropdownAction[] = [
				{
					caption: '市场平均PE',
					action: this.controller.openMarketPE,
					icon: 'bar-chart',
				},
				{
					caption: '选择股票',
					action: this.controller.onAddStock,
					icon: 'money',
				},
				undefined,
				...stockGroups,
				undefined,
				...groups,
				undefined,
				{
					caption: '管理自选组',
					action: this.controller.manageGroups,
					icon: 'object-group',
				},
				{
					caption: '管理持仓账号',
					action: this.controller.manageAccounts,
					icon: 'book',
				},
			];
			if (this.isDev === true) {
				let { cBug, cUI } = this.controller.cApp;
				actions.push(
					undefined,
					{
						caption: t('UI') as string,
						icon: 'television', 
						action: () => cUI.start(),
					},
					{
						caption: t('debug') as string,
						icon: 'bug', 
						action: () => cBug.start(),
					}
				);
			}

			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}

	protected onPageScrollBottom(scroller: Scroller): Promise<void> {
		this.controller.onPage();
		return;
	}

	content() {
		return React.createElement(observer(() => {
			let {setSortType, stockGroup, sortType} = this.controller;
			/*
			let {store} = cApp;
			let {config} = store;
			let title = config.groupName;
			let { items } = home;
			*/
			let title = stockGroup.name;
			let items = stockGroup.stocks;

			let {  onSelectTag, onAddStock } = this.controller;
			/*
			let right = <div className="d-flex">
				<div className="btn cursor-pointer" onClick={onAddStock}><FA name="plus" inverse={false} /></div>
				<div className="btn cursor-pointer ml-2" onClick={onSelectTag}><FA name="bars" inverse={false} /></div>
			</div>;
			let left = <div className="align-self-center">{title}</div>
			<LMR className="px-2 py-1" left={left} right={right}></LMR>
			*/
			return <div>
				<div className="d-flex justify-content-end mr-2 my-1">
					{renderSortHeaders('radioHome', sortType, setSortType)}
				</div>
				<List items={items}
					item={{ render: this.renderRow, key: this.rowKey }}
					before={'...'}
					none={<small className="px-3 py-3 text-info">无自选股, 请选股</small>}
				/>
			</div>;
		}));
	}

	renderRow = (item: any, index: number): JSX.Element => { //<this.rowContent {...item} />;
		return this.rowContent(item);
	} 
	protected rowContent = (row: any): JSX.Element => {
		let right = renderStockUrl(row);
		return renderStockInfoRow(row, this.onClickName, null, right);
	}

	private rowKey = (item: any) => {
		let { id } = item;
		return id;
	}

	protected onClickName = (item: NStockInfo) => {
		this.controller.openStockInfo(item);
	}

	protected onSelected = async (item: any): Promise<void> => {
		let a = 0;
	}

	private callOnSelected(item: any) {
		if (this.onSelected === undefined) {
		alert('onSelect is undefined');
		return;
		}
		this.onSelected(item);
	}
	clickRow = (item: any) => {
		this.callOnSelected(item);
	}
}