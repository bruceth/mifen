/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, LMR, FA, Scroller } from 'tonva-react';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../tool/GFunc';
import { CExplorer } from './CExplorer';
import { renderSortHeaders, renderStockInfoRow, renderStockUrl } from '../tool';

export class VExplorer extends VPage<CExplorer> {
	header() {return '股票发现'}
	protected onPageScrollBottom(scroller: Scroller): Promise<void> {
		this.controller.onPage();
		return;
	}

	right() {
		let { onConfig } = this.controller;
		return <div className="btn align-self-center cursor-pointer " onClick={onConfig}><FA name="cog" size="lg" inverse={true} /></div>
	}

	content() {
		return React.createElement(observer(() => {
			let {explore, load, setSortType} = this.controller;
			let {items, avgs, sortType } = explore;

			let left: any;
			let right = <div className="btn btn-link cursor-pointer py-1" onClick={load}>刷新</div>;
			/*if (avgs.avg20 !== undefined || avgs.avg50 !== undefined || avgs.avg100 !== undefined) {
				let avgStr = ` top20 : ${GFunc.numberToFixString(avgs.avg20)} 
  -  top50 : ${GFunc.numberToFixString(avgs.avg50)}
  -  top100 : ${GFunc.numberToFixString(avgs.avg100)}
  -  all : ${GFunc.numberToFixString(avgs.avg)}
  ...查看历史走势`;
				left = <div className="px-3 cursor-pointer align-self-center"
					onClick={this.controller.onClickPredictAVG}>
						{GFunc.caption('价值指数均值')}{avgStr}
					</div>;
			}*/
			if (avgs.avg !== undefined) {
				let avgStr = ` : ${GFunc.numberToFixString(Math.log(avgs.avg), 1)}`;
				left = <div className="px-3 cursor-pointer align-self-center">
						{GFunc.caption('米息分均值')}{avgStr}
					</div>;
			}			
			return <>
				<LMR left={left} right={right} />
				<div className="d-flex justify-content-end mr-2 my-1">
					{renderSortHeaders('radioHome', sortType, setSortType)}
				</div>
				<List items={items}
					item={{ render: this.renderRow, key: this.rowKey }}
					before={'选股'}
				/>
			</>
		}));
	}

	renderRow = (item: any, index: number): JSX.Element => {
		return this.rowContent(item);
	} 
	protected rowContent = (row: any): JSX.Element => {
		let {store} = this.controller.cApp;
		let { id, symbol } = row as NStockInfo;
		//if (store.isMyBlack(id) === true) return null;
		let labelId = 'vexl_' + id;
		let isMySelect = store.isMyAll(undefined); // defList.findIndex(v=>v===id);
		let middle = <label className="mb-0 cursor-pointer">
			<input className="mr-1" type="checkbox" value="" id={labelId}
			defaultChecked={isMySelect}
			onChange={e => this.onSelect(row, e.target.checked)}/>
			<small className="text-muted">自选</small>
		</label>;

		let right = <div className="d-flex">
			{renderStockUrl(row)}
		</div>;
		return renderStockInfoRow(row, this.onClickName, middle, right);
	};

	private rowKey = (item: any) => {
		if (item.item !== undefined) {
			return item.item.id;
		}
		let { id } = item;
		return id;
	}

	protected onClickName = (item: NStockInfo) => {
		this.controller.openStockInfo(item);
	}

	protected onSelect = async (item: any, isSelected:boolean): Promise<void> => {
		this.controller.onSelectItem(item, isSelected);
	}

	protected onClickItem = async (item: any): Promise<void> => {
		this.controller.openStockInfo(item);
	}
}