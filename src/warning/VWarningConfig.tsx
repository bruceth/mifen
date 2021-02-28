/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, UiSelect, UiTextItem } from 'tonva';
import { CWarning } from './CWarning';
import { GFunc } from 'tool/GFunc';

export class VWarningConfig extends VPage<CWarning> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private onSelect = (item: any, isSelected: boolean, anySelected: boolean) => {
    //this.controller.onTaged(item, isSelected);
  }

  private page = observer(() => {
    let { warnings } = this.controller;
    let divNewTag = warnings.length >= 100 ? '' :
      <div className="px-3 py-2 cursor-pointer" onClick={this.controller.onNewWarning}><FA name="plus" className="text-primary" /> &nbsp; 新建预警</div>;
    return <Page header="预警" headerClassName="bg-primary">
      {divNewTag}
      <List items={warnings} 
        item={{ render: this.renderWarning }} 
        none={'--'} />
    </Page>;
  })

  private renderWarning = (witem: any) => {
    let {name, code, type, price} = witem;
    let left = <div className="px-3 cursor-pointer">
      {name}
      <small className=" mx-3" >{code}</small></div>;
    return <LMR className="mx-3 my-2" left={left} >
      <div className="d-flex flex-wrap">
        <div className="px-3 c6">{GFunc.warningTypeString(type)}</div>
        <div className="px-3 c6">{GFunc.numberToFixString(price)}</div>
      </div>
    </LMR>;
  }
}

const schema: ItemSchema[] = [
  { name: 'id', type: 'id' } as IdSchema,
  { name: 'type', type: 'string', required: true, maxLength: 2 } as StringSchema,
  { name: 'price', type: 'number', required: true},
  { name: 'submit', type: 'submit', },
];

const uiSchema: UiSchema = {
  items: {
    id: { widget: 'id',
      label: '股票',
      visible: true} as UiIdItem,
    type: { widget: 'select', label: '类型', 
    list: [{value:'gt', title:'大于'}, {value:'lt', title:'小于'}] } as UiSelect,
    price: { widget: 'text', label: '价格', placeholder: '0.00'} as UiTextItem,
    submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
  }
};

export class VNewWarning extends VPage<CWarning> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private newuiSchema: UiSchema = {
    items: {
      id: { widget: 'id',
        label: '股票',
        visible: true,
        placeholder: <small className="text-muted">请选择股票</small>,
        pickId: async (context: Context, name: string, value: number) => {
          return await this.controller.showSelectStock(context, name, value)
        },
        Templet: (item: any) => {
          let { name, code } = item;
          if (!item) return <small className="text-muted">请选择股票</small>;
          return <div>
              {name}
              <small className=" mx-3" >{code}</small>
          </div>;
        }
      } as UiIdItem,
      type: { widget: 'select', label: '类型', 
      list: [{value:'gt', title:'大于'}, {value:'lt', title:'小于'}] } as UiSelect,
      price: { widget: 'text', label: '价格', placeholder: '0.00'} as UiTextItem,
      submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
    }
  };
  
  private onFormButtonClick = async (name: string, context: Context) => {
    await this.controller.onSaveNewWarning(context.data);
  }

  private page = () => {
    let fData = {type:'lt'};
    return <Page header="新建预警" headerClassName="bg-primary">
      <div className="px-3 py-3">
        <Form schema={schema}
          uiSchema={this.newuiSchema}
          formData={fData}
          onButtonClick={this.onFormButtonClick}
        />
      </div>
    </Page>;
  }
}

export class VEditWarning extends VPage<CWarning> {
  async open(param?: any) {
    this.openPage(this.page, param);
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    await this.controller.onSaveWarning(context.data);
  }

  private page = (param?: any) => {
    let {id, type, price} = param;
    let fData = {id:id, type:type, price:price};
    return <Page header="编辑预警" headerClassName="bg-primary">
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
