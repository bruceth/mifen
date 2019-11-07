/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, NumSchema } from 'tonva';
import { CAccountInit } from './CAccountInit';

const schema: ItemSchema[] = [
  { name: 'marketvalue', type: 'number', required: true } as NumSchema,
  { name: 'share', type: 'number', required: true } as NumSchema,
];

export class VInitAccount extends VPage<CAccountInit> {
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

  uiSchema: UiSchema = {
    items: {
      marketvalue: { widget: 'text', label: '市值', placeholder: '0.00' } as UiInputItem,
      share: { widget: 'text', label: '份额', placeholder: '0.00' } as UiInputItem,
    }
  };
 
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

    let fData = { marketvalue:0, share:0};

    if (accountInit === undefined) {
      fData = { marketvalue:undefined, share:undefined};
    }
    else {
      fData = { marketvalue: accountInit.marketvalue, share:accountInit.share };
    }
    return <>
      <LMR className="px-3 py-1" left={title}></LMR>
      <div className="flex-fill px-3 py-2">
        <Form schema={schema}
            uiSchema={this.uiSchema}
            formData={fData}
          />
      </div>
    </>;
  });
}