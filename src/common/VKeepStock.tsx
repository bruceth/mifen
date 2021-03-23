import { MiAccount, MiGroup } from "store";
import { FA, VPage } from "tonva-react";
import { Stock } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VKeepStock extends VPage<CCommon> {
	private param: {stock: Stock; miAccounts: MiAccount[]; miGroups: MiGroup[]};
	init(param: any) {
		this.param = param;
	}
	header() {return '删除选股'}
	content() {
		let {stock, miAccounts, miGroups} = this.param;
		return <div className="py-3">
			<div className="bg-white px-3 py-2 text-info">
				<FA name="exclamation-circle" className="mr-3 text-danger" />
				<b className="text-primary">{stock.name}</b> 无法从自选股删除
			</div>
			{
				miAccounts.length > 0 && <>
					<div className="small px-3 mt-3 mb-1">持仓</div>
					<div className="p-3 bg-white">
						{miAccounts.map((v, index) => <span key={index} className="mr-3">{v.name}</span>)}
					</div>
				</>
			}
			{
				miGroups.length > 0 && <>
					<div className="small px-3 mt-3 mb-1">分组</div>
					<div className="p-3 bg-white">
						{miGroups.map((v, index) => <span key={index} className="mr-3">{v.name}</span>)}
					</div>
				</>
			}
		</div>
	}
}