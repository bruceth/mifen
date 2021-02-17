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
      <div className="px-3 py-1 c8 cursor-pointer" onClick={()=>{this.controller.openMarketPE()}}>市场平均PE</div>
      <this.content />
    </Page>;
  })

  private setSortType = (type:string) => {
    this.controller.setSortType(type);
  }

  private content = observer(() => {
    let title = this.controller.cApp.config.tagName;
    let { items } = this.controller;
    let { onSelectTag, onAddStock } = this.controller;
    let header = <div className="px-3">
      <div className="px-3 c6" />
      <div className="px-3 c5 cursor-pointer" onClick={(e)=>this.setSortType('tagpe')}>TTM</div>
      <div className="px-3 c6 cursor-pointer" onClick={(e)=>this.setSortType('tagdp')}>股息率</div>
      <div className="px-3 c6 cursor-pointer" onClick={(e)=>this.setSortType('tagv')}>估值率</div>
    </div>;
    let right = <div className="d-flex">
        <div className="btn cursor-pointer" onClick={onAddStock}><FA name="plus" inverse={false} /></div>
        <div className="px-1"></div>
        <div className="btn cursor-pointer" onClick={onSelectTag}><FA name="bars" inverse={false} /></div>
    </div>;
    return <>
      <LMR className="px-3 py-1" left={title} right={right}></LMR>
      <List header={header}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        before={'搜索'}
        none={'----'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = (row: any): JSX.Element => {
    let { id, name, code, symbol, pe, roe, price, exprice, ep, v, e, e3, order, divyield, l, predictpe, total } = row as NStockInfo;
    let left = <><div className="px-1 align-self-center">
        <div className="pr-1"><span className="text-muted small">{''}</span><br />{order.toString()}</div>
      </div>
      <div className="c5 cursor-pointer" onClick={()=>this.onClickName(row)} ><span className="text-primary">{name}</span><br/>{code}</div>
    </>

    let right = <div className="d-flex">
        <a className="px-3 text-info" href={`https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>新浪财经</a>
      </div>;
    return <LMR className="px-3 py-1" left={left} right={right} >
      <div className="d-flex flex-wrap">
        <div className="px-3 c5">{GFunc.caption('TTM')}<br />{GFunc.numberToFixString(pe)}</div>
        <div className="px-3 c6">{GFunc.caption('股息率')}<br />{GFunc.percentToFixString(divyield)}</div>
        <div className="px-3 c6">{GFunc.caption('估值率')}<br />{GFunc.numberToFixString(v)}</div>
        <div className="px-3 c5">{GFunc.caption('价格')}<br />{GFunc.numberToFixString(price)}</div>
        <div className="px-3 c5">{GFunc.caption('复权')}<br />{GFunc.numberToFixString(exprice)}</div>
        <div className="px-3 c5">{GFunc.caption('e')}<br />{GFunc.numberToString(e, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('e1')}<br />{GFunc.numberToString(ep, 3)}</div>
        <div className="px-3 c5">{GFunc.caption('e3')}<br />{GFunc.numberToString(e3, 3)}</div>
        <div className="px-3 c6">{GFunc.caption('ROE')}<br />{GFunc.percentToFixString(roe)}</div>
        <div className="px-3 c6">{GFunc.caption('增率')}<br />{GFunc.percentToFixString(l)}</div>
        <div className="px-3 c8">{GFunc.caption('市值')}<br />{GFunc.numberToMarketValue(total*price)}</div>
      </div>
    </LMR>
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