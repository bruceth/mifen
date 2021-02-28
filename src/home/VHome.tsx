/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA, Scroller } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { CHome } from './CHome';
import { renderSortHeaders, renderStockInfoRow } from '../tool';

export class VHome extends VPage<CHome> {

/*
  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView, onPage } = this.controller;
    // let viewMetaButton = <></>;
    // if (this.controller.isLogined) {
    //   viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    // }
	let right = ;

    return <Page header="首页" right={right} onScrollBottom={onPage}
      headerClassName='bg-primary py-1 px-3'>      
      <this.content />
    </Page>;
  })
*/
  header() {return '首页'}
  right() {
	return <button className="btn btn-sm btn-info"
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
    console.log('vhome content()')

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
      <LMR className="px-3 py-1" left={left} right={right}></LMR>
      <List header={renderSortHeaders(this.setSortType)}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        before={'搜索'}
        none={'----'}
      />
      </div>;
    }));
  }

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { symbol } = row as NStockInfo;
    let right = <div className="d-flex">
        <a className="px-3 text-info" href={`https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>新浪财经</a>
      </div>;
	return renderStockInfoRow(row, this.onClickName, right);
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