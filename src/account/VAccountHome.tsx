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
  });

  private rightSelectAccount = () => {
    return <div className="btn cursor-pointer" onClick={this.controller.onSelectAccount}><FA name="cog" inverse={false} /></div>;
  }

  private inputInitContent = () => {
    let accountName = this.controller.cApp.config.accountName;
    let title = accountName === undefined ? '--' : accountName;
    return <>
    <LMR className="px-3 py-1" left={title} right={this.rightSelectAccount()}></LMR>
      <div className="px-3 py-2 bg-white">
        <button className="cursor-pointer" onClick={() => this.controller.onClickInit()}>输入初值</button>
      </div>
    </>;
  }

  private initContent = observer(() => {
    let { accountInit, onClickInit, onClickLockInit } = this.controller;
    let title = this.controller.cApp.config.accountName;
    let rightEdit =
      <div className="d-flex">
        <div className="btn cursor-pointer" onClick={onClickInit}>编辑</div>&nbsp;
        <div className="btn cursor-pointer" onClick={onClickLockInit}>锁定</div>
      </div>
    return <>
      <LMR className="px-3 py-2" left={title} right={this.rightSelectAccount()}></LMR>
      <LMR className="px-3 py-1 bg-white" left="--初值--" right={rightEdit}></LMR>
      <div className="d-flex flex-wrap bg-white">
        <div className="px-3 c10">{GFunc.caption('市值')}{accountInit.marketvalue}</div>
        <div className="px-3 c10">{GFunc.caption('份额')}{accountInit.share}</div>
        <div className="px-3 c10">{GFunc.caption('余额')}{accountInit.money}</div>
        <div className="px-3 c18">{GFunc.caption('净值')}{GFunc.numberToFixString(accountInit.marketvalue/accountInit.share, 3)}</div>
      </div> 
      <LMR className="px-3 py-1" left="--明细--"></LMR>
      <List items={accountInit.detail} 
        item={{ render: this.renderDetailRow, key: this.rowKey }}
        none={'--'}>
      </List>
    </>;
  });

  private lastContent = observer(() => {
    let { accountLast } = this.controller;
    let title = this.controller.cApp.config.accountName;
    if (accountLast === undefined || accountLast.marketvalue === undefined) {
      return <>
        <LMR className="px-3 py-2" left={title} right={this.rightSelectAccount()}></LMR>
        <LMR className="px-3 py-1" left="--明细--"></LMR>
      </>;
    }
    return <>
      <LMR className="px-3 py-2" left={title} right={this.rightSelectAccount()}></LMR>
      <div className="d-flex flex-wrap bg-white">
        <div className="px-3 c10">{GFunc.caption('市值')}{accountLast.marketvalue}</div>
        <div className="px-3 c10">{GFunc.caption('份额')}{accountLast.share}</div>
        <div className="px-3 c10">{GFunc.caption('余额')}{accountLast.money}</div>
        <div className="px-3 c18">{GFunc.caption('净值')}{GFunc.numberToFixString(accountLast.marketvalue/accountLast.share, 3)}</div>
      </div> 
      <LMR className="px-3 py-1" left="--明细--"></LMR>
      <List items={accountLast.detail} 
        item={{ render: this.renderDetailRow, key: this.rowKey }}
        none={'--'}>
      </List>
    </>;
  });


  private accountContent = observer(() => {
    let { accountInit } = this.controller;
    let accountName = this.controller.cApp.config.accountName;
    let title = accountName === undefined ? '--' : accountName;
    if (accountName !== undefined) {
      if (accountInit === undefined) {
        return <this.inputInitContent />;
      }
      else {
        if (accountInit.lock === 0) {
          if (accountInit.share === undefined) {
            return <this.inputInitContent />;
          }
          else {
            return <this.initContent />;
          }
        }
        else {
          return <this.lastContent />;
        }
      }
    }
    return <>
      <LMR className="px-3 py-1" left={title} right={this.rightSelectAccount()}></LMR>
    </>;
  });

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  renderDetailRow = (item: any, index: number): JSX.Element => <this.rowDetailContent {...item} />;
  protected rowDetailContent = (row: any): JSX.Element => {
    let { id, volume, price, name, code } = row;
    let left = <div className="c6"><span className="text-primary">{name || id.name}</span><br />{code || id.code}</div>
    return <LMR className="px-3 py-2" left={left} >
      <div className="d-flex flex-wrap">
        <div className="px-3 c10">{GFunc.caption('数量')}{volume}</div>
        <div className="px-3 c8">{GFunc.caption('价格')}{GFunc.numberToFixString(price)}</div>
        <div className="px-3 c10">{GFunc.caption('市值')}{GFunc.numberToFixString(volume*price)}</div>
      </div>  
    </LMR>
  }
}

export class VLockAccountConfirm extends VPage<CAccountHome> {
  async open(param?: any) {
    this.openPage(this.page, param);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private rowKey = (item: any) => {
    let { id } = item;
    return id;
  }

  renderDetailRow = (item: any, index: number): JSX.Element => <this.rowDetailContent {...item} />;
  protected rowDetailContent = (row: any): JSX.Element => {
    let { id, volume, price, name, code } = row;
    let left = <div className="c6"><span className="text-primary">{name || id.name}</span><br />{code || id.code}</div>
    return <LMR className="px-3 py-2" left={left} >
      <div className="d-flex flex-wrap">
        <div className="px-3 c10">{GFunc.caption('数量')}{volume}</div>
        <div className="px-3 c8">{GFunc.caption('价格')}{GFunc.numberToFixString(price)}</div>
        <div className="px-3 c10">{GFunc.caption('市值')}{GFunc.numberToFixString(volume*price)}</div>
      </div>  
    </LMR>
  }

  private initContent = observer(() => {
    let { accountInit, onClickInit, onClickLockInit } = this.controller;
    return <>
      <LMR className="px-3 py-1 bg-white" left="--初值--"></LMR>
      <div className="d-flex flex-wrap bg-white">
        <div className="px-3 c10">{GFunc.caption('市值')}{accountInit.marketvalue}</div>
        <div className="px-3 c10">{GFunc.caption('份额')}{accountInit.share}</div>
        <div className="px-3 c10">{GFunc.caption('余额')}{accountInit.money}</div>
        <div className="px-3 c18">{GFunc.caption('净值')}{GFunc.numberToFixString(accountInit.marketvalue/accountInit.share, 3)}</div>
      </div> 
      <LMR className="px-3 py-1" left="--明细--"></LMR>
      <List items={accountInit.detail} 
        item={{ render: this.renderDetailRow, key: this.rowKey }}
        none={'--'}>
      </List>
    </>;
  });

  private page = observer((item?:any) => {
    let accountName = this.controller.cApp.config.accountName;
    return <Page header="确认账号初值" 
      headerClassName='bg-primary py-1 px-3'>
      <LMR className="px-3 py-1" left={accountName} ></LMR>
        <div className="px-3 py-2 bg-white">
          <button className="cursor-pointer" onClick={() => this.controller.onClickLockInitConfirm()}>初值录入完成</button>
        </div>
      <this.initContent />
    </Page>;
  })
}
