import { observer } from "mobx-react";
import React from "react";
import { FA, List, Scroller, SearchBox, VPage } from "tonva-react";
import { renderStockRow } from "tool";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CFind } from "./CFind";

const cnStar = 'small border rounded py-1 px-2 mr-3 ';

export class VStocksPage extends VPage<CFind> {
	header() {return React.createElement(observer(() => <span className="">{this.controller.header}</span>))}
	content() {
		let { pageStocks, onClickStock } = this.controller;
		return <div className="pt-1 pb-3">
			{this.renderStars()}
			<List items={pageStocks} item={{render: this.renderStock, onClick: onClickStock}} />
		</div>
	}
	right():JSX.Element {
		let {key} = this.controller.searchParam;
		return <SearchBox className="mr-2 w-max-10c"
			onSearch={this.searchInGroup} 
			initKey={key}
			placeholder={key? '搜索' : this.controller.header+'中搜索'} />;
	}

	private searchInGroup = async (key: string) => {
		let {searchParam} = this.controller;
		searchParam.key = key;
		await this.controller.research();
	}

	private renderStars():JSX.Element {
		return React.createElement(observer(() => {
			let { smooth } = this.controller;
			let stars:number[] = [];
			for (let i=0;i<5; i++) stars[i] = 4-i;
			return <div className="px-3 py-1 d-sm-flex d-block">
				<div className="d-flex py-1">
					{
						stars.map(v => {
							let cn:string, icon:string;
							if (v === smooth) {
								icon = 'star';
								cn = cnStar + ' text-warning border-primary bg-white';
							}
							else if (v<smooth) {
								cn = cnStar + ' cursor-pointer text-muted ';
								icon = 'star-o';
							}
							else {
								cn = cnStar + ' cursor-pointer text-warning bg-white';
								icon = 'star';
							}
							return <div key={v} className={cn} onClick={() => this.controller.changeSmooth(v)}>
								{v===0? '全部' : <>{v}<FA name={icon} /></>}
							</div>
						})
					}
				</div>
				<div className="text-muted small py-1 ml-auto align-self-center">
					<FA name="star-o" /> 近五年分红增长持续度
				</div>
			</div>;
		}));
	}
	//<button onClick={this.controller.cApp.cCommon.showEmptyPage}>test</button>

	private renderStock = (stock: Stock & StockValue): JSX.Element => {
		let pinStock = this.controller.cApp.cCommon.renderPinStock(stock, 1);
		let {$order} = stock as any;
		return renderStockRow($order, stock, this.onClickName, pinStock);
	}

	private onClickName = (stock: Stock & StockValue) => {
		this.controller.cApp.openStock(stock);
	}

	protected async onPageScrollBottom(scroller: Scroller): Promise<void> {
		await this.controller.pageStocks.more();
	}
}
/*
<button className="btn btn-sm btn-outline-primary" 
onClick={() => this.controller.selectStock(stock)}>
<FA name="cog" className="text-warning small" /> 设自选
</button>
*/