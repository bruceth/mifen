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
      avg100:avgs.avg100,
      avg:avgs.avg,
    }
    this.controller.cApp.openPredictAVG(param);
  }

  private content = observer(() => {
    let {items, avgs, reload} = this.controller;
    let avgHead: JSX.Element;
    let right = <div>
      <div className="btn cursor-pointer py-3" onClick={reload}>刷新</div>
    </div>
    if (avgs.avg20 !== undefined || avgs.avg50 !== undefined || avgs.avg100 !== undefined) {
      let avgStr = ' top20 : ' + GFunc.numberToFixString(avgs.avg20) 
          + '  -  top50 : ' + GFunc.numberToFixString(avgs.avg50)
          + '  -  top100 : ' + GFunc.numberToFixString(avgs.avg100)
          + '  -  all : ' + GFunc.numberToFixString(avgs.avg)
          + '  ...查看历史走势';
      avgHead = <LMR right={right}><div className="px-3 cursor-pointer" onClick={this.onClickPredictAVG}>{GFunc.caption('价值指数均值')}{avgStr}</div></LMR>
    }
    else {
      avgHead = <LMR right={right}></LMR>
    }
    
    let header = <div className="px-3">
      <div className="px-3 c6"/>
      <div className="px-3 c5 cursor-pointer" onClick={(e)=>this.setSortType('tagpe')}>TTM</div>
      <div className="px-3 c6 cursor-pointer" onClick={(e)=>this.setSortType('tagdp')}>股息率</div>
      <div className="px-3 c5 cursor-pointer" onClick={(e)=>this.setSortType('tagv')}>估值率</div>
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
    let { id, name, code, pe, roe, price, exprice, divyield, v, order, symbol, l, predictpe, e, ep, e3, total } = row as NStockInfo;
    //let left = <div className="c5"><span className="text-primary">{name}</span><br/>{code}</div>
    let labelId = 'vexl_' + id;
    let left = <label htmlFor={labelId} className="d-inline-flex px-2" onClick={e=>{e.stopPropagation()}}>
      <div className="px-1 align-self-center">
      <div className="pr-1"><span className="text-muted small">{''}</span><br />{order.toString()}</div>
        </div>
      <div className="c5 cursor-pointer" onClick={()=>this.onClickName(row)} ><span className="text-primary">{name}</span><br/>{code}</div>
    </label>

    let blackList = this.controller.cApp.blackList;
    let fInBlack = blackList.findIndex(v=>v===id);
    if (fInBlack >= 0)
      return <></>;
    else { //
      let defList = this.controller.cApp.defaultList;
      let fInDef = defList.findIndex(v=>v===id);
      let right = <div className="d-flex">
          <a className="px-3 text-info" href={`https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>新浪财经</a>
          <div className="px-1"><span className="text-muted small">自选</span><br />
          <input className="" type="checkbox" value="" id={labelId}
            defaultChecked={fInDef >= 0}
            onChange={(e)=>{
                this.onSelect(row, e.target.checked)} 
            }/>
          </div>
        </div>;
      return <><LMR className="px-1 py-1" left={left} right = {right} >
        <div className="d-flex flex-wrap" >
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

  private setSortType = (type:string) => {
    this.controller.setSortType(type);
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