/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, LMR, FA, Scroller } from 'tonva-react';
import { NStockInfo } from '../stockinfo';
import { CHome } from './CHome';
import { renderSortHeaders, renderStockInfoRow, renderStockUrl } from '../tool';

export class VHome extends VPage<CHome> {
  header() {
    return '首页'
  }
  right() {
  	return <button className="btn btn-sm btn-info mr-2"
	  	onClick={()=>{this.controller.openMarketPE()}}>
		  市场平均PE
	  </button>;
  }

  protected onPageScrollBottom(scroller: Scroller): Promise<void> {
	this.controller.onPage();
	return;
  }

  private setSortType = (type:string) => {
    this.controller.setSortType(type);
  }

  content() {
	  return React.createElement(observer(() => {
      let title = this.controller.cApp.config.tagName;
      let { items } = this.controller;
      let { onSelectTag, onAddStock } = this.controller;
      let right = <div className="d-flex">
        <div className="btn cursor-pointer" onClick={onAddStock}><FA name="plus" inverse={false} /></div>
        <div className="btn cursor-pointer ml-2" onClick={onSelectTag}><FA name="bars" inverse={false} /></div>
      </div>;
      let left = <div className="align-self-center">{title}</div>
      return <div>
      <LMR className="px-2 py-1" left={left} right={right}></LMR>
      <List header={renderSortHeaders('radioHome', this.setSortType)}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        before={'搜索'}
        none={<small className="px-2 py-3 text-info">无自选股, 请选股</small>}
      />
      </div>;
    }));
  }

  renderRow = (item: any, index: number): JSX.Element => { //<this.rowContent {...item} />;
    return this.rowContent(item);
  } 
  protected rowContent = (row: any): JSX.Element => {
    let right = renderStockUrl(row);
	return renderStockInfoRow(row, this.onClickName, null, right);
  }

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  protected onClickName = (item: NStockInfo) => {
    this.controller.openStockInfo(item);
  }

  protected onSelected = async (item: any): Promise<void> => {
    let a = 0;
  }

  private callOnSelected(item: any) {
    if (this.onSelected === undefined) {
      alert('onSelect is undefined');
      return;
    }
    this.onSelected(item);
  }
  clickRow = (item: any) => {
    this.callOnSelected(item);
  }
}