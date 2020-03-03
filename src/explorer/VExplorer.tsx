/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../GFunc';
import { CExplorer } from './CExplorer';
import { PredictHistoryParam } from 'predicthistory/CPredictHistory';

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
    let { onConfig, reload } = this.controller;
    let right = <div className="btn align-self-center cursor-pointer " onClick={onConfig}><FA name="cog" size="lg" inverse={true} /></div>
    return <Page header="股票发现"  onScrollBottom={onPage} right={right}
      headerClassName='bg-primary py-1 px-3'>
      
      <this.content />
    </Page>;
  })

  private onClickPredictAVG = () => {
    let {avgs, lastTradeDay} = this.controller;
    let param: PredictHistoryParam = {
      day:undefined,
      priceDay:lastTradeDay,
      avg20:avgs.avg20,
      avg50:avgs.avg50,
      avg100:avgs.avg100
    }
    this.controller.cApp.openPredictAVG(param);
  }

  private content = observer(() => {
    let sType = this.controller.cApp.findStockConfg.selectType;
    let {items, selectedItems,avgs, reload, onAddSelectedItemsToTag} = this.controller;
    let avgHead: JSX.Element;
    let right = <div>
      <div className="btn cursor-pointer py-3" onClick={onAddSelectedItemsToTag}>加自选</div>
      <div className="btn cursor-pointer py-3" onClick={reload}>刷新</div>
    </div>
    if (avgs.avg20 !== undefined || avgs.avg50 !== undefined || avgs.avg100 !== undefined) {
      let avgStr = ' top20 : ' + GFunc.percentToFixString(avgs.avg20) + '  -  top50 : ' + GFunc.percentToFixString(avgs.avg50) + '  -  top100 : ' + GFunc.percentToFixString(avgs.avg100) + '  ...查看历史走势';
      avgHead = <LMR right={right}><div className="px-3 cursor-pointer" onClick={this.onClickPredictAVG}>{GFunc.caption('预测收益比均值')}{avgStr}</div></LMR>
    }
    else {
      avgHead = <LMR right={right}></LMR>
    }
    
    let header = <div className="px-3">
      <div className="px-3 c6"/>
      <div className="px-3 c5">TTM</div>
      <div className="px-3 c6">股息率</div>
    </div>;
    return <>
      {avgHead}
      <List header={header}
        items={items}
        item={{ render: this.renderRow, key: this.rowKey }}
        before={'选股'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = observer((row: any): JSX.Element => {
    let sName = this.controller.cApp.config.stockFind.selectType;
    let { id, name, code, pe, roe, price, divyield, ma, order, symbol, b, r2, l, lr2, lr4, predictpp, b10, r210, l10, lr210 } = row as NStockInfo;
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
          <div className="px-1"><span className="text-muted small">{'序号'}</span><br />{order.toString()}</div>
        </div>;
      return <><LMR className="px-1 py-1" left={left} right = {right} >
        <div className="d-flex flex-wrap" onClick={()=>this.onClickName(row)} >
          <div className="px-3 c5">{GFunc.caption('TTM')}<br />{GFunc.numberToFixString(pe)}</div>
          <div className="px-3 c6">{GFunc.caption('股息率')}<br />{GFunc.percentToFixString(divyield)}</div>
          <div className="px-3 c6">{GFunc.caption('价/预期')}<br />{GFunc.percentToFixString(predictpp)}</div>
          <div className="px-3 c6">{GFunc.caption('ROE')}<br />{GFunc.percentToFixString(roe)}</div>
          <div className="px-3 c5">{GFunc.caption('价格')}<br />{GFunc.numberToFixString(price)}</div>
          <div className="px-3 c5">{GFunc.caption('b')}<br />{GFunc.numberToString(b, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('R2')}<br />{GFunc.numberToString(r2, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('l')}<br />{GFunc.numberToString(l, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('lR2')}<br />{GFunc.numberToString(lr2, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('l/4')}<br />{GFunc.numberToString(lr4, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('b10')}<br />{GFunc.numberToString(b10, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('R210')}<br />{GFunc.numberToString(r210, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('l10')}<br />{GFunc.numberToString(l10, 3)}</div>
          <div className="px-3 c5">{GFunc.caption('lR210')}<br />{GFunc.numberToString(lr210, 3)}</div>
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
    this.controller.onSelectItem(item, isSelected);
  }

  protected onClickItem = async (item: any): Promise<void> => {
    this.controller.openStockInfo(item);
  }
}