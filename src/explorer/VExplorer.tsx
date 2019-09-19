import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { CExplorer } from './CExplorer';

export class VExplorer extends View<CExplorer> {

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView, onPage } = this.controller;
    let viewMetaButton = <></>;
    if (this.controller.isLogined) {
      viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    }

    return <Page header="股票发现"  onScrollBottom={onPage} 
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private onSelect = (item:any, isSelected:boolean, anySelected:boolean) => {

  }

  private content = observer(() => {
    let {PageItems} = this.controller;
    let header = <div className="px-3">
      <div className="px-3 c6"/>
      <div className="px-3 c8">PE</div>
      <div className="px-3 c8">ROE</div>
      <div className="px-3 c8">PRICE</div>
    </div>;
    return <>
      <List header={header}
        items={PageItems}
        item={{ render: this.renderRow, onClick: this.onSelected, key: this.rowKey }}
        before={'搜索' + ' ' + '资料'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order } = row as NStockInfo;
    let left = <div className="c6"><span className="text-primary">{name}</span><br/>{code}</div>
    return <LMR className="px-3 py-2" left={left} right = {order.toString()} onClick={()=>this.onClickName(row)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 c8 d-flex">{pe.toFixed(2)}</div>
        <div className="px-3 c8"> {roe===undefined?'':(roe * 100).toFixed(2)}</div>
        <div className="px-3 c8"> {price.toFixed(2)}</div>
      </div>
    </LMR>
  }

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  protected onClickName = (item: NStockInfo) => {
    this.controller.openStockInfo(item);
    /* let {symbol} = item;
    event.preventDefault();
    let url = `http://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
    window.open(url, '_blank'); */
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