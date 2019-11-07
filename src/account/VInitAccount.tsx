/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { CAccountHome } from './CAccountHome';

export class VInitAccount extends View<CAccountHome> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    return <Page header="账号初值" 
      headerClassName='bg-primary py-1 px-3'>
      <this.accountContent />
    </Page>;
  })

  private accountContent = observer(() => {
    let { accountInit } = this.controller;
    let accountName = this.controller.cApp.config.accountName;
    let title = accountName === undefined ? '--' : accountName;
    if (accountName === undefined) {
      return <>
        <LMR className="px-3 py-1" left={title}></LMR>
        <div className="px-3 py-2 bg-white">请先选择账号</div>
      </>;
    }
    if (accountInit !== undefined && accountInit.lock > 0) {
      return <>
        <LMR className="px-3 py-1" left={title}></LMR>
        <div className="px-3 py-2 bg-white">账号已经完成初值设置</div>
      </>;
    }

    if (accountInit === undefined) {
      return <>
        <LMR className="px-3 py-1" left={title}></LMR>
        <div className="px-3 py-2 bg-white">
        </div>
      </>;
    }
    else {
    }
    return <>
      <LMR className="px-3 py-1" left={title}></LMR>
    </>;
  });
}