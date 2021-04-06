import React from "react";
import { observer } from "mobx-react";
import { DropdownAction, DropdownActions, FA, LMR, VPage } from "tonva-react";
import { CHome } from "./CHome";

export class VHome extends VPage<CHome> {
	header() { return '首页'; }
	content() {
		return React.createElement(observer(() => {
			let {cAccount} = this.controller;
			let left = <FA name="envelope-o" className="text-info align-self-center ml-2 ml-sm-3" size="lg" fixWidth={true} />
			return <div className="pb-3">
				<LMR className="d-flex pr-3 py-2 my-2 cursor-pointer bg-white"
					left={left}
					onClick={this.controller.showBlogs}>
					<div className="px-2 px-sm-3">
						米投博客
					</div>
				</LMR>
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
