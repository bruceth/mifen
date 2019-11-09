/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../GFunc';
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
    let { onConfig } = this.controller;
    let right = <div className="btn cursor-pointer" onClick={onConfig}><FA name="cog" size="lg" inverse={true} /></div>;

    return <Page header="股票发现"  onScrollBottom={onPage} right={right}
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private onSelect = (item:any, isSelected:boolean, anySelected:boolean) => {

  }

  private content = observer(() => {
    let {PageItems} = this.controller;
    let header = <div className="px-3">
      <div className="px-3 c5"/>
      <div className="px-3 c6">PE</div>
      <div className="px-3 c6">股息率</div>
      <div className="px-3 c6">ROE</div>
      <div className="px-3 c6">价格</div>
    </div>;
    return <>
      <List header={header}
        items={PageItems}
        item={{ render: this.renderRow, onClick: this.onSelected, key: this.rowKey }}
        before={'搜索 资料'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = observer((row: any): JSX.Element => {
    let { id, name, code, pe, roe, price, order, divyield } = row as NStockInfo;
    let left = <div className="c5"><span className="text-primary">{name}</span><br/>{code}</div>
    let blackList = this.controller.cApp.blackList;
    let fInBlack = blackList.findIndex(v=>v===id);
    if (fInBlack >= 0)
      return <></>;
    else
      return <LMR className="px-3 py-2" left={left} right = {order.toString()} onClick={()=>this.onClickName(row)}>
      <div className="d-flex">
        <div className="px-3 c6">{GFunc.numberToFixString(pe)}</div>
        <div className="px-3 c6"> {GFunc.percentToFixString(divyield)}</div>
        <div className="px-3 c6"> {GFunc.percentToFixString(roe)}</div>
        <div className="px-3 c6"> {GFunc.numberToFixString(price)}</div>
      </div>
    </LMR>
  });

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