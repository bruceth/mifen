import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, List, VPage } from "tonva-react";
import { CGroup } from "./CGroup";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { renderStockRow } from "tool";

export class VGroup extends VPage<CGroup> {
	header() {
		return React.createElement(observer(() => {
			return <span className="ml-3">
				组 - {this.controller.uqs.BruceYuMi.Group.t(this.controller.miGroup?.name)}
			</span>;
		}));
	}
	content() {
		return React.createElement(observer(() => {
			let {miGroup, onStockClick} = this.controller;
			if (!miGroup) return <div>no group</div>;
			return <div>
				<List items={miGroup.stocks} item={{onClick: onStockClick, render: this.renderStock}} />
			</div>;
		}));
	}

	private onClickName = (stock:Stock) => {

	}

	private renderStock = (stock:Stock, index:number) => {
		let inputSelect = <>select</>;
		let right = <>right</>;
		return renderStockRow(1, stock as Stock & StockValue, this.onClickName, inputSelect, right);
	}

	right() {
		return React.createElement(observer(() => {
			let {store} = this.controller.cApp;
			let groups = store.miGroups.getMemuItems(this.controller.changeMiGroup);
			/*
			.groups.map(v => {
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
			*/
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