import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, VPage } from "tonva-react";
import { CHome } from "./CHome";

export class VHome extends VPage<CHome> {
	header() { return '首页'; }
	content() {
		return React.createElement(observer(() => {
			let {cAccount} = this.controller;
			return <div className="pb-3">
				{cAccount.renderAccounts()}
			</div>;
		}));
	}

	right() {
		return React.createElement(observer(() => {
			let {cCommon} = this.controller.cApp;
			let actions: DropdownAction[] = [
				{
					caption: '管理持仓账户',
					action: cCommon.manageAccounts,
					icon: 'money',
				},
			];
			return <DropdownActions actions={actions} icon="bars" className="mr-2 text-white bg-transparent border-0" />;
		}));
	}
}
