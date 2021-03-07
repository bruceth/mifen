import { VPage } from "tonva-react";
import { CMe } from "./CMe";

export class VFaq extends VPage<CMe> {
	header() {return '基本概念'}
	content() {
		return <ul>
			<li className="my-3">
				<div className="my-2">基本公理</div>
				<ul className="px-3 text-info">
					<li><span className="mr-3">公理1: </span>进步是社会的必然</li>
					<li><span className="mr-3">公理2: </span>信任是经济的基石</li>
					<li><span className="mr-3">公理3: </span>价值是价格的准心</li>
					<li><span className="mr-3">公理4: </span>发展是企业的基因</li>
				</ul>
			</li>
			<li className="my-3">
				<div className="my-2">米投定律</div>
				<ul className="px-3 text-info">
					<li><span className="mr-3">定律1: </span>投资无风险</li>
				</ul>
			</li>
			<li className="my-3">
				<div className="my-2">米投原则</div>
				<ul className="px-3 text-info">
					<li><span className="mr-3">原则1: </span>低估</li>
					<li><span className="mr-3">原则2: </span>分散</li>
					<li><span className="mr-3">原则3: </span>不深研</li>
				</ul>
			</li>
			<li className="my-3">
				<div className="my-2">米息定义</div>
				<ul className="px-3 text-info">
					<li><span className="mr-3">定义1: </span>米息 = 增息 + 股息</li>
					<li><span className="mr-3">定义2: </span>增息 = 企业未来三年利润增长值</li>
					<li><span className="mr-3">定义3: </span>米息率 = 米息 / 股价</li>
					<li><span className="mr-3">定义4: </span>米息率大一倍，米息分加1</li>
					<li><span className="mr-3">定义5: </span>PE = 股价 / 利润</li>
				</ul>
			</li>
		</ul>
	}
}