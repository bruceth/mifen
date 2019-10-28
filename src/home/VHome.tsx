/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../GFunc';
import { CHome } from './CHome';

export class VHome extends View<CHome> {

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView, onPage } = this.controller;
    let viewMetaButton = <></>;
    if (this.controller.isLogined) {
      viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    }
    let title = this.controller.cApp.config.tagName;
    let { onTags } = this.controller;

    let right = <button className="btn btn-outline-success bg-light" onClick={onTags}>...
    </button>;


    return <Page header={title} right={right} onScrollBottom={onPage}
      headerClassName='bg-primary py-1 px-3'>
      <this.content />
    </Page>;
  })

  private onSelect = (item: any, isSelected: boolean, anySelected: boolean) => {
  }

  private setSortTypeTagpe = () => {
    this.controller.cApp.setUserSortType('tagpe');
  }

  private setSortTypeTagdp = () => {
    this.controller.cApp.setUserSortType('tagdp');
  }

  private content = observer(() => {
    let { PageItems } = this.controller;
    let header = <div className="px-3">
      <div className="px-3 c6" />
      <div className="px-3 c6 cursor-pointer" onClick={this.setSortTypeTagpe}>PE</div>
      <div className="px-3 c6 cursor-pointer" onClick={this.setSortTypeTagdp}>股息率</div>
      <div className="px-3 c6">ROE</div>
      <div className="px-3 c6">价格</div>
    </div>;
    return <>
      <List header={header}
        items={PageItems}
        item={{ render: this.renderRow, onClick: this.onSelected, key: this.rowKey }}
        before={'搜索'}
        none={'----'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order, divyield } = row as NStockInfo;
    let left = <div className="c6"><span className="text-primary">{name}</span><br />{code}</div>
    return <LMR className="px-3 py-2" left={left} right={order.toString()} onClick={() => this.onClickName(row)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 c6 d-flex">{GFunc.numberToFixString(pe)}</div>
        <div className="px-3 c6"> {GFunc.percentToFixString(divyield)}</div>
        <div className="px-3 c6"> {GFunc.percentToFixString(roe)}</div>
        <div className="px-3 c6"> {GFunc.numberToFixString(price)}</div>
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