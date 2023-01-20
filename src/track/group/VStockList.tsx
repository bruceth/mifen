import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, List, VPage } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { renderStockRow } from "tool";
import { CGroup } from "./CGroup";
import { VRootIndustry } from "./VRootIndustry";

export class VStockList extends VPage<CGroup> {
	private renderRowRight: (stock: Stock & StockValue) => JSX.Element;
	private renderPageRight: () => JSX.Element;
	init(param: {
		renderRowRight: (stock: Stock & StockValue) => JSX.Element;
		renderPageRight: () => JSX.Element;
	}) {
		let {renderRowRight, renderPageRight} = param;
		this.renderRowRight = renderRowRight;
		this.renderPageRight = renderPageRight;
	}

	header() {
		return React.createElement(observer(() => {
            let str = this.controller.listCaption + ' - ' + this.controller.track.trackDay;
            return <>{str}</>
        }));
	}
	
    right(): JSX.Element {
		//return this.renderPageRight?.();
		return React.createElement(observer(() => {
			let { cCommon } = this.controller.cApp;
            let { miGroup } = this.controller;
			let actions: DropdownAction[] = [
                {
					caption: '跳到下一周',
					action: this.controller.onNextTrackDay,
					icon: 'calendar-plus-o',
                },
                {
					caption: '跳到下一月',
					action: this.controller.onNextTrackMonth,
					icon: 'calendar-plus-o',
                },
			];
            if (miGroup.type === 'group') {
                let cID = cCommon.buildCIDUserGroup();
                cID.item = miGroup;
                let onEditItem = () => {
                    cID.onItemEdit();
                }
                actions.push({
					caption: '编辑',
					action: onEditItem,
					icon: 'pencil-square-o',
                })
            }
			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}

	content() {
		return React.createElement(observer(() => {
			let {miGroup, stocks} = this.controller;
			let vGroups: any;
			if (miGroup) {
				let {groups} = miGroup;
				if (groups) {
					vGroups = this.renderVm(VRootIndustry, groups);
				}
			}
			return <div>
				{vGroups}
				<List items={stocks} item={{render: this.renderStock}} />
			</div>;
		}));
	}

	private onClickName = (stock:Stock & StockValue) => {
		this.controller.onStockClick(stock);
	}

	private renderStock = (stock:Stock & StockValue, index:number) => {
		let right = this.renderRowRight?.(stock);
		let {$order} = stock as unknown as any;
		return renderStockRow($order, stock as Stock & StockValue, this.onClickName, right);
	}
}
