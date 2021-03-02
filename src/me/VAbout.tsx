import { FA, VPage } from "tonva-react";
import { appConfig } from "../appConfig";
import { CMe } from "./CMe";

export class VAbout extends VPage<CMe> {
	header() {return '关于APP';}
	content() {
		return <div className="py-5 px-3 my-3 w-max-30c mx-auto bg-white">
			<div className="text-center mb-5 position-relative">
				<small className="text-muted position-absolute"
					style={{right:'0', top:'-2.8rem'}}>
					版本: {appConfig.version}
				</small>
				<i className="text-danger position-absolute top-0 start-0 fa fa-fire fa-2x" 
					style={{left:'2rem', top:'0.5rem'}} />
				<b className="text-danger h5 mb-0">
					<span className="text-primary">鱼</span>
					<b className="mx-1">米</b>
					<span className="text-success">乡</span>
				</b>
				<br/>
				<small className="text-info">私享投资圈</small>
			</div>
			<ul>
				<li>跟家人和好友一起分享投资思考。</li>
				<li>世界级投资大师年化收益率11%。</li>
				<li>全球最大的成长经济体GDP增长率高于5%。</li>
				<li>以10%为基础，期待<b className="text-danger mx-1">15%以上</b>的高水平。</li>
			</ul>
			<div className="mt-5 text-center">
				<small className="text-muted mr-2">by</small>
				同花投顾
			</div>
		</div>;
	}
}
