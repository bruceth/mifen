/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, View, List, LMR, left0, FA } from 'tonva';
import { observer } from 'mobx-react';
import { CStockInfo } from './CStockInfo'
import { NStockInfo, StockCapitalearning, StockBonus } from './StockInfoType';

export class VStockInfo extends VPage<CStockInfo> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { openMetaView, baseItem, onTags, stockTags, isLogined } = this.controller;
    let { name, code } = baseItem;
    let viewMetaButton = <></>;
    if (isLogined) {
      viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    }
    let right = stockTags && <button className="btn btn-outline-success bg-light" onClick={onTags}>
      {stockTags.length === 0? '加自选' : '设分组'}
      </button>;
    return <Page header={name + ' ' + code} right={right}
      headerClassName='bg-primary'>
      <this.content />
    </Page>;
  })

  private content = observer(() => {
    return <>
      <this.baseInfo />
      <this.capitalEarning />
      <this.bonus />
    </>
  });

  private caption = (value:string) => <span className="text-muted small">{value}: </span>;

  private baseInfo = () => {
    let {baseItem} = this.controller;
    let { name, code, pe, roe, price, order } = baseItem;
    return <div className="px-3 py-2 bg-white" onClick={() => this.onClickName(this.controller.baseItem)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 c8">{this.caption('PE')}{pe.toFixed(2)}</div>
        <div className="px-3 c8">{this.caption('ROE')}{roe===undefined?'':(roe * 100).toFixed(2)}</div>
        <div className="px-3 c8">{this.caption('Price')}{price.toFixed(2)}</div>
      </div>    
    </div>;
  }

  protected onClickName = (item: NStockInfo) => {
    let { symbol } = item;
    //window.event.preventDefault();
    let url = `http://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
    window.open(url, '_blank');
  }

  private capitalEarning = observer(() => {
    let items = this.controller.capitalearning;
    let header = <div className="px-3">
      <div className="px-3 c6">年</div>
      <div className="px-3 c6 text-right">股本</div>
      <div className="px-3 c6 text-right">收益</div>
      <div className="px-3 c6 text-right">ROE</div>
    </div>;
    return <>
      <div className="px-3 py-1">历年股本收益</div>
      <List header={header} loading="..."
        items={items}
        item={{
          render: (row: StockCapitalearning) => {
            let {capital, earning} = row;
            return <div className="px-3 py-2 d-flex flex-wrap">
              <div className="px-3 c6">{row.year}</div>
              <div className="px-3 c6 text-right"> {capital.toFixed(2)}</div>
              <div className="px-3 c6 text-right"> {earning.toFixed(2)}</div>
              <div className="px-3 c6 text-right"> {(earning/capital*100).toFixed(1)}%</div>
            </div>
          }
        }}
      />
    </>
  });

  private bonus = observer(() => {
    let items = this.controller.bonus;
    let header = <div className="px-3">
      <div className="px-3 c8">日期</div>
      <div className="px-3 c6 text-right">分红</div>
    </div>;
    return <>
      <div className="px-3 py-1">历年分红</div>
      <List header={header} loading="..."
        items={items}
        item={{
          render: (row: StockBonus) => {
            return <div className="px-3 py-2 d-flex flex-wrap">
              <div className="px-3 c8">{row.day}</div>
              <div className="px-3 c6 text-right"> {row.bonus.toFixed(2)}</div>
            </div>
          }
        }}
      />
    </>
  });
}