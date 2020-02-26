/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { GFunc } from '../GFunc';
import { CHistoryExplorer } from './CHistoryExplorer';

export class VHistoryExplorer extends View<CHistoryExplorer> {
  private input: HTMLInputElement;
  private key: string = null;

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    let { avgs, resultday } = this.controller;
    let avgStr = ' - ';
    if (resultday !== undefined) {
      avgStr = resultday + ' -  top20 : ' + GFunc.percentToFixString(avgs.avg20) + '  -  top50 : ' + GFunc.percentToFixString(avgs.avg50) + '  -  top100 : ' + GFunc.percentToFixString(avgs.avg100);
    }
    return <Page header="股票历史选股"
      headerClassName='bg-primary py-1 px-3'>
      <this.searchHead />
      <div className="px-3 bg-white">{GFunc.caption('预测收益比均值')}{avgStr}</div>
      <this.content />
    </Page>;
  })

  private onChange = (evt: React.ChangeEvent<any>) => {
    let v = evt.target.value;
    let n = Number(v);
    if (isNaN(n) === true || !Number.isInteger(n)) {
      if (this.input) {
        this.input.value = this.key;
      }
      return;
    }
    this.key = evt.target.value;
    if (this.key !== undefined) {
        this.key = this.key.trim();
        if (this.key === '') this.key = undefined;
    }
  }

  private onSubmit = async (evt: React.FormEvent<any>) => {
    evt.preventDefault();
    if (this.key === null) this.key = '';
    let n = Number(this.key);
    if (!isNaN(n) && Number.isInteger((n))) {
      if (n >= 20000101 && n < 30000101) {
        this.controller.day = n;
        await this.controller.load();
      }
    }
  }

  private searchHead = () => {
    return <form className="mx-1 w-100 py-2" onSubmit={this.onSubmit} >
    <div className={classNames("input-group", "input-group-sm")}>
      <label className="input-group-addon px-2">{'日期'}</label>
      <input ref={v=>this.input=v} onChange={this.onChange}
            type="text"
            name="key"
            className="form-control border-primary px-2"
            placeholder={'yyyymmdd'}
            maxLength={8} />
      <div className="input-group-append">
            <button className="btn btn-primary px-2"
                type="submit">
                <i className='fa fa-search' />
                <i className="fa"/>
                {'查询'}
            </button>
      </div>
    </div>
</form>;
  }

  private content = observer(() => {
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
        before={'历史选股'}
        none={'----'}
      />
    </>
  });

  renderRow = (item: any, index: number): JSX.Element => <this.rowContent {...item} />;
  protected rowContent = observer((row: any): JSX.Element => {
    let sName = this.controller.cApp.config.stockFind.selectType;
    let { id, name, code, e, capital, bonus, price, nprice, order, symbol, b, r2, l, lr2, lr4, b10, r210, l10, lr210, predictpp } = row as NStockInfo;
    let pe = price / e;
    let roe = e / capital;
    let divyield = bonus / price;

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
          <div className="px-3 c6">{GFunc.caption('年涨幅')}<br />{GFunc.percentToFixString(nprice/price-1)}</div>
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

}