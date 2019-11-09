/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { GFunc } from '../GFunc';
import { CAccountHome } from './CAccountHome';

export class VAccountHome extends View<CAccountHome> {
  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    return <Page header="记账" 
      headerClassName='bg-primary py-1 px-3'>
      <this.accountContent />
    </Page>;
  })

  private caption = (value:string) => <span className="text-muted small">{value}: </span>;

  private accountContent = observer(() => {
    let { onSelectAccount, accountInit, accountLast, onClickInit } = this.controller;
    let accountName = this.controller.cApp.config.accountName;
    let title = accountName === undefined ? '--' : accountName;
    let right = <div className="btn cursor-pointer" onClick={onSelectAccount}><FA name="cog" inverse={false} /></div>;
    if (accountName !== undefined) {
      if (accountInit === undefined) {
        return <>
          <LMR className="px-3 py-1" left={title} right={right}></LMR>
          <div className="px-3 py-2 bg-white">
          <button className="cursor-pointer" onClick={() => onClickInit()}>输入初值</button>
          </div>
        </>;
      }
      else {
        if (accountInit.lock === 0) {
          if (accountInit.share === undefined) {
            return <>
            <LMR className="px-3 py-1" left={title} right={right}></LMR>
            <div className="px-3 py-2 bg-white">
            <button className="cursor-pointer" onClick={() => onClickInit()}>输入初值</button>
            </div>
          </>;
          }
          else {
            return <>
            <LMR className="px-3 py-2" left={title} right={right}></LMR>
            <LMR className="px-3 py-1 bg-white" left="--初值--"></LMR>
            <div className="d-flex flex-wrap bg-white">
              <div className="px-3 c10">{this.caption('市值')}{accountInit.marketvalue}</div>
              <div className="px-3 c10">{this.caption('份额')}{accountInit.share}</div>
              <div className="px-3 c10">{this.caption('余额')}{accountInit.money}</div>
            </div> 
            <LMR className="px-3 py-1" left="--明细--"></LMR>
            <List items={accountInit.detail} 
              item={{ render: this.renderDetailRow, key: this.rowKey }}
              none={'--'}>
            </List>
            </>;
          }
        }
      }
    }
    return <>
        <LMR className="px-3 py-1" left={title} right={right}></LMR>
      </>;
  });

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  renderDetailRow = (item: any, index: number): JSX.Element => <this.rowDetailContent {...item} />;
  protected rowDetailContent = (row: any): JSX.Element => {
    let { id, volume, price } = row;
    let left = <div className="c6"><span className="text-primary">{id.name}</span><br />{id.code}</div>
    return <LMR className="px-3 py-2" left={left} >
      <div className="d-flex flex-wrap">
        <div className="px-3 c12">{this.caption('数量')}{volume}</div>
        <div className="px-3 c8">{this.caption('价格')}{GFunc.numberToFixString(price)}</div>
      </div>  
    </LMR>
  }
}