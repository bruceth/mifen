/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { VPage, List, LMR, SearchBox, Scroller } from 'tonva-react';
import { CSelectStock } from './CSelectStock'

export class VStockSelect extends VPage<CSelectStock> {
	private onClickStock = async (model: any) => {
		await this.controller.returnStock(model);
		this.closePage();
	}

	header() {return '选择股票'}
	get headerClassName() {return 'bg-primary'}
	protected async onPageScrollBottom(scroller: Scroller) {
		await this.controller.pageItems.more();
	}

	content() {
		let { pageItems, searchByKey } = this.controller;
		let none = <div className="p-3 small text-muted">无结果</div>;
		return <div>
			<SearchBox className="px-1 w-100  mt-2 mr-2"
				size='md'
				allowEmptySearch={true}
				onSearch={searchByKey}
				placeholder="搜索股票" />
			<List before={''} none={none} 
				items={pageItems} 
				item={{ render: this.renderStock, onClick: this.onClickStock }} />
		</div>
	}

	private renderStock = (stock: any, index: number) => {
		let { name, code } = stock;
		return <LMR className="px-3 py-2 " >
			<div className="font-weight-bold"></div>
			<div>{name + ' ' + code}</div>
		</LMR >
	}
}