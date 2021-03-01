/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, LMR, FA, Scroller } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../tool/GFunc';
import { CExplorer } from './CExplorer';
import { PredictHistoryParam } from 'predicthistory/CPredictHistory';
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

  private onClickPredictAVG = () => {
    let {avgs, lastTradeDay} = this.controller;
    let param: PredictHistoryParam = {
      day:undefined,
      priceDay:lastTradeDay,
      avg20:avgs.avg20,
      avg50:avgs.avg50,
      avg100:avgs.avg100,
      avg:avgs.avg,
    }
    this.controller.cApp.openPredictAVG(param);
  }

  content() {
	  return React.createElement(observer(() => {
      let {items, avgs, reload} = this.controller;
      let avgHead: JSX.Element;
      let right = <div>
      <div className="btn cursor-pointer py-3" onClick={reload}>刷新</div>
      </div>
      if (avgs.avg20 !== undefined || avgs.avg50 !== undefined || avgs.avg100 !== undefined) {
      let avgStr = ' top20 : ' + GFunc.numberToFixString(avgs.avg20) 
        + '  -  top50 : ' + GFunc.numberToFixString(avgs.avg50)
        + '  -  top100 : ' + GFunc.numberToFixString(avgs.avg100)
        + '  -  all : ' + GFunc.numberToFixString(avgs.avg)
        + '  ...查看历史走势';
      avgHead = <LMR right={right}><div className="px-3 cursor-pointer" onClick={this.onClickPredictAVG}>{GFunc.caption('价值指数均值')}{avgStr}</div></LMR>
      }
      else {
      avgHead = <LMR right={right}></LMR>
      }
      
      return <>
      {avgHead}
      <List header={renderSortHeaders(this.setSortType)}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        before={'选股'}
      />
      </>
    }));
  }

  renderRow = (item: any, index: number): JSX.Element => { //<this.rowContent {...item} />;
    return this.rowContent(item);
  } 
  protected rowContent = (row: any): JSX.Element => {
    let blackList = this.controller.cApp.blackList;
    let fInBlack = blackList.findIndex(v=>v===id);
    if (fInBlack >= 0) return null;

    let { id, symbol } = row as NStockInfo;
    let labelId = 'vexl_' + id;
	let defList = this.controller.cApp.defaultList;
	let fInDef = defList.findIndex(v=>v===id);
	let middle = <label className="mb-0 cursor-pointer">
		<input className="mr-1" type="checkbox" value="" id={labelId}
		defaultChecked={fInDef >= 0}
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

  private setSortType = (type:string) => {
    this.controller.setSortType(type);
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