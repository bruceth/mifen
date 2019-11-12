/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR } from 'tonva';
import { CAccountHome } from './CAccountHome';

export class VSelectAccounts extends VPage<CAccountHome> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private onClickItem = (item: any) => {
    this.controller.onClickSelectAccount(item);
  }

  private onEditAccount = (item:any, e:React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.controller.onEditAccount(item);
  }

  private renderAccount = (item: any) => {
    let left = <div className="px-3 py-2 cursor-pointer">{item.name}</div>;
    let right = <div className="px-3 py-2 cursor-pointer" onClick={(e)=>this.onEditAccount(item, e)}>编辑</div>;
    return <LMR className="mx-3 my-2" left={left} right={right}>
    </LMR>;
  }

  private page = observer(() => {
    let { accounts } = this.controller.cApp;
    let divNewAccount = accounts.length >= 10 ? '' :
      <div className="px-3 py-2 cursor-pointer" onClick={this.controller.onNewAccount}><FA name="plus" className="text-primary" /> &nbsp; 新建账号</div>;
    return <Page header="选择账号" headerClassName="bg-primary">
      {divNewAccount}
      <List items={accounts} item={{ onClick: this.onClickItem, render: this.renderAccount }} />
    </Page>;
  })
}

const schema: ItemSchema[] = [
  { name: 'name', type: 'string', required: true, maxLength: 10 } as StringSchema,
  { name: 'id', type: 'id' } as IdSchema,
  { name: 'submit', type: 'submit', },
];
const uiSchema: UiSchema = {
  items: {
    name: { widget: 'text', label: null, placeholder: '账号名称' } as UiInputItem,
    id: { widget: 'id', visible: false } as UiIdItem,
    submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
  }
};

export class VNewAccount extends VPage<CAccountHome> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    await this.controller.onSaveNewAccount(context.data);
    this.closePage();
  }

  private page = () => {
    return <Page header="新建账号" headerClassName="bg-primary">
      <div className="px-3 py-3">
        <Form schema={schema}
          uiSchema={uiSchema}
          formData={undefined}
          onButtonClick={this.onFormButtonClick}
        />
      </div>
    </Page>;
  }
}

export class VEditAccount extends VPage<CAccountHome> {
  async open(param?: any) {
    this.openPage(this.page, param);
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    await this.controller.onSaveAccount(context.data);
  }

  private page = (param?: any) => {
    let {id, name} = param;
    let fData = {id:id, name:name};
    return <Page header="编辑账号名称" headerClassName="bg-primary">
      <div className="px-3 py-3">
        <Form schema={schema}
          uiSchema={uiSchema}
          formData={fData}
          onButtonClick={this.onFormButtonClick}
        />
      </div>
    </Page>;
  }
}
