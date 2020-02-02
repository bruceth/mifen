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

  private content = observer(() => {
    let sType = this.controller.cApp.findStockConfg.selectType;
    let {items, selectedItems} = this.controller;
    
    let header = <div className="px-3">
      <div className="px-3 c6"/>
      <div className="px-3 c5">TTM</div>
      <div className="px-3 c6">股息率</div>
    </div>;
    return <>
      <List header={header}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        selectedItems={selectedItems}
        before={'选股'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = observer((row: any): JSX.Element => {
    let sName = this.controller.cApp.config.stockFind.selectType;
    let { id, name, code, pe, roe, price, divyield, ma, symbol, b, r2, l, lr2, lr4, predictep, predictepe, predicteps } = row as NStockInfo;
    //let left = <div className="c5"><span className="text-primary">{name}</span><br/>{code}</div>
    let labelId = 'vexl_' + id;
    let left = <label htmlFor={labelId} className="d-inline-flex px-2" onClick={e=>{e.stopPropagation()}}>
      <div className="px-2 align-self-center">
      <input className="" type="checkbox" value="" id={labelId}
        defaultChecked={false}
        onChange={(e)=>{
            this.onSelect(row, e.target.checked)} 
        }/>
        </div>
      <div className="c5"><span className="text-primary">{name}</span><br/>{code}</div>
    </label>

    let blackList = this.controller.cApp.blackList;
    let fInBlack = blackList.findIndex(v=>v===id);
    if (fInBlack >= 0)
      return <></>;
    else { //
      let defList = this.controller.cApp.defaultList;
      let fInDef = defList.findIndex(v=>v===id);
      let right = <div className="d-flex">
          <div className="px-1"><span className="text-muted small">自选</span><br />{fInDef >= 0?'√' :''}</div>
          <div className="px-1"><span className="text-muted small">{sName === 'all'?'序号': '评分'}</span><br />{ma.toString()}</div>
        </div>;
      return <><LMR className="px-1 py-1" left={left} right = {right} >
        <div className="d-flex flex-wrap" onClick={()=>this.onClickName(row)} >
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
      </LMR></>
    }
  });

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
    let {selectedItems} = this.controller;
    let a = 0;
  }

  protected onClickItem = async (item: any): Promise<void> => {
    this.controller.openStockInfo(item);
  }

  protected onSelected = async (item: any, isSelected:boolean, anySelected:boolean): Promise<void> => {
    let {selectedItems} = this.controller;
    let a = 0;
  }

  // private callOnSelected(item: any) {
  //   if (this.onSelected === undefined) {
  //     alert('onSelect is undefined');
  //     return;
  //   }
  //   this.onSelected(item);
  // }
  // clickRow = (item: any) => {
  //   this.callOnSelected(item);
  // }
}