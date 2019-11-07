/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
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
      }
    }
    return <>
      <LMR className="px-3 py-1" left={title} right={right}></LMR>
    </>;
  });
}