import { VPage } from "tonva-react";
import { CMe } from "./CMe";

export class VRuler extends VPage<CMe> {
	header() {return '买入规则'}
	content() {
		return <ul>
			<li className="my-3">
				<div className="my-2">买入规则</div>
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
	}
}