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
			let leftruler = <FA name="comments-o" className="text-info align-self-center ml-2 ml-sm-3" size="lg" fixWidth={true} />
			return <div className="pb-3">
				<LMR className="d-flex pr-3 py-2 my-2 cursor-pointer bg-white"
					left={left}
					onClick={this.controller.showBlogs}>
					<div className="px-2 px-sm-3">
						米投博客
					</div>
				</LMR>
                <ul className="pr-3 py-2 my-2 bg-white">
                    <li className="my-3">
                        <div className="my-2">交易规则</div>
                        <ul className="px-3 text-info">
                            <li><span className="mr-3">规则1: </span>每周可以进行一次买入操作。每次买入一只，金额为账户总值的1%</li>
                            <li><span className="mr-3">规则2: </span>同一只股票最多可以买入10次</li>
                            <li><span className="mr-3">规则3: </span>买入同一只股票股票的时间间隔必须超过12周，即一个季度</li>
                            <li><span className="mr-3">规则4: </span>买入股票的米息率，必须高于已经持有股票最低米息率的50%</li>
                            <li><span className="mr-3">规则5: </span>买入的股票必须通过一票否决条款的审核</li>
                            <li><span className="mr-3">规则6: </span>股票行业按照大行业为准。强相关的门类算一个行业</li>
                            <li><span className="mr-3">规则7: </span>一个行业的买入次数不能超过25次。如果发生一次卖出，减一次</li>
                        </ul>
                    </li>
                    <li className="my-3">
                        <div className="my-2">一票否决条款</div>
                        <ul className="px-3 text-info">
                            <li><span className="mr-3">条款1: </span>非金融类企业资产负责率超过80%</li>
                            <li><span className="mr-3">条款2: </span>最近两个季度，营业收入增长连续为负</li>
                            <li><span className="mr-3">条款3: </span>最近两年ROE连续小于5%</li>
                            <li><span className="mr-3">条款4: </span>市值小于50亿，美股市值小于10亿</li>
                            <li><span className="mr-3">条款5: </span>三年内发生欺骗股东的企业丑闻</li>
                            <li><span className="mr-3">条款6: </span>年报中出现非“标准无保留意见的审计报告”</li>
                            <li><span className="mr-3">条款7: </span>企业不能长期稳定经营</li>
                        </ul>
                    </li>
                </ul>
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
