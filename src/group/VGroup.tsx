import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, List, VPage } from "tonva-react";
import { CGroup } from "./CGroup";
import { EnumGroupType, Stock } from "uq-app/uqs/BruceYuMi";

export class VGroup extends VPage<CGroup> {
	header() {
		return React.createElement(observer(() => {
			return <span className="ml-3">
				组 - {this.controller.uqs.BruceYuMi.Group.t(this.controller.miGroup.name)}
			</span>;
		}));
	}
	content() {
		let {miGroup, onStockClick} = this.controller;
		return <div>
			<List items={miGroup.stocks} item={{onClick: onStockClick, render: this.renderStock}} />
		</div>;
	}

	private renderStock = (stock:Stock, index:number) => {
		return <>{JSON.stringify(stock)}</>;
	}

	right() {
		return React.createElement(observer(() => {
			let {store, uqs} = this.controller.cApp;
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