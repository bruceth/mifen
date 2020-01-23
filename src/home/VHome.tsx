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
    // let viewMetaButton = <></>;
    // if (this.controller.isLogined) {
    //   viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
    // }

    return <Page header="首页" onScrollBottom={onPage}
      headerClassName='bg-primary py-1 px-3'>
      <this.warningContent />
      <this.content />
    </Page>;
  })

  private setSortType = (type:string) => {
    this.controller.cApp.setUserSortType(type);
  }

  private warningContent = observer(() => {
    let header = <div className="px-3">
      <div className="px-3 c6" />
      <div className="px-3 c6">预警价</div>
      <div className="px-3 c6">价格</div>
    </div>;
    let { onWarningConfg, warnings } = this.controller;
    let right = <div className="btn cursor-pointer" onClick={onWarningConfg}><FA name="cog" inverse={false} /></div>;
    return <>
      <LMR className="px-3 py-1" left="预警" right={right}></LMR>
      <List 
        items={warnings}
        item={{ render: this.renderWarningRow, key: this.rowKey }}
        before={'搜索'}
        none={'----'}
      />
    </>;
  });

  renderWarningRow = (item: any, index: number): JSX.Element => <this.rowWarningContent {...item} />;
  protected rowWarningContent = (row: any): JSX.Element => {
    let { id, name, code, wprice, price} = row;
    let left = <div className="c6"><span className="text-primary">{name}</span><br />{code}</div>
    return <LMR className="px-3 py-2" left={left} onClick={() => this.onClickName(row)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 c6">{GFunc.caption('预警价')}<br />{GFunc.numberToFixString(wprice)}</div>
        <div className="px-3 c6">{GFunc.caption('价格')}<br />{GFunc.numberToFixString(price)}</div>
      </div>
    </LMR>
  }

  private content = observer(() => {
    let title = this.controller.cApp.config.tagName;
    let { items } = this.controller;
    let { onSelectTag } = this.controller;
    let header = <div className="px-3">
      <div className="px-3 c5" />
      <div className="px-3 c5 cursor-pointer" onClick={(e)=>this.setSortType('tagpe')}>TTM</div>
      <div className="px-3 c6 cursor-pointer" onClick={(e)=>this.setSortType('tagdp')}>股息率</div>
      <div className="px-3 c6 cursor-pointer" onClick={(e)=>this.setSortType('tagpredict')}>预期</div>
    </div>;
    let right = <div className="btn cursor-pointer" onClick={onSelectTag}><FA name="bars" inverse={false} /></div>;
    return <>
      <LMR className="px-3 py-1" left={title} right={right}></LMR>
      <List header={header}
        items={items}
        item={{ render: this.renderRow, onClick: this.onSelected, key: this.rowKey }}
        before={'搜索'}
        none={'----'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order, divyield, b, r2, l, lr2, lr4, predictep, predictepe, predicteps } = row as NStockInfo;
    let left = <div className="c5"><span className="text-primary">{name}</span><br />{code}</div>
    let right = <div className="px-1"><span className="text-muted small">序号</span><br />{order.toString()}</div>
    return <LMR className="px-3 py-1" left={left} right={right} onClick={() => this.onClickName(row)}>
      <div className="d-flex flex-wrap">
        <div className="px-3 c5">{GFunc.caption('TTM')}<br />{GFunc.numberToFixString(pe)}</div>
        <div className="px-3 c6">{GFunc.caption('股息率')}<br />{GFunc.percentToFixString(divyield)}</div>
        <div className="px-3 c6">{GFunc.caption('预期')}<br />{GFunc.percentToFixString(predictep)}</div>
        <div className="px-3 c6">{GFunc.caption('ROE')}<br />{GFunc.percentToFixString(roe)}</div>
        <div className="px-3 c5">{GFunc.caption('价格')}<br />{GFunc.numberToFixString(price)}</div>
        <div className="px-3 c5">{GFunc.caption('b')}<br />{GFunc.numberToString(b, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('R2')}<br />{GFunc.numberToString(r2, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('l')}<br />{GFunc.numberToString(l, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('lR2')}<br />{GFunc.numberToString(lr2, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('l/4')}<br />{GFunc.numberToString(lr4, 3)}</div>
        <div className="px-3 c6">{GFunc.caption('预期指数')}<br />{GFunc.percentToFixString(predictepe)}</div>
        <div className="px-3 c6">{GFunc.caption('预期线性')}<br />{GFunc.percentToFixString(predicteps)}</div>
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