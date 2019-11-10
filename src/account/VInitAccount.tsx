/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, NumSchema, UiTextItem, UiRange } from 'tonva';
import { GFunc } from '../GFunc';
import { CAccountInit } from './CAccountInit';

const schema: ItemSchema[] = [
  { name: 'marketvalue', type: 'number' } as NumSchema,
  { name: 'share', type: 'number', required: true } as NumSchema,
  { name: 'money', type: 'number', required: true } as NumSchema,
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

  private uiSchema: UiSchema = {
    items: {
      marketvalue: { label: '市值', placeholder: '0.00', readOnly:true } as UiInputItem,
      share: { label: '份额', placeholder: '0.00',
        onChanged:(context:Context, value:any, prev:any) => {
          this.controller.onShareChanged(value);
        }
       } as UiInputItem,
      money: { label: '余额', placeholder: '0.00', 
        onChanged:(context:Context, value:any, prev:any) => {
          this.controller.onMoneyChanged(value);
        }
        } as UiInputItem,
    }
  };

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
        <div className="px-3 c12">{GFunc.caption('数量')}{volume}</div>
        <div className="px-3 c8">{GFunc.caption('价格')}{GFunc.numberToFixString(price)}</div>
        <div className="px-3 c12">{GFunc.caption('市值')}{GFunc.numberToFixString(volume*price)}</div>
      </div>  
    </LMR>
  }
 
  private accountContent = observer(() => {
    let { accountInit, onAddDetail } = this.controller;
    let marketvalue = this.controller.MarketValue;
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

    let fData = { marketvalue:0, share:0, money:0};

    fData = { marketvalue: marketvalue, share: accountInit.share, money:accountInit.money };

    let detailRight = <div className="btn cursor-pointer" onClick={onAddDetail}><FA name="plus" inverse={false} /></div>;

    return <>
      <LMR className="px-3 py-1" left={title}></LMR>
      <div className="px-3 py-2">
        <Form fieldLabelSize={2} schema={schema}
            uiSchema={this.uiSchema}
            formData={fData}
          />
      </div>
      <LMR className="px-3 py-1" left="明细" right={detailRight}></LMR>
      <List items={accountInit.detail} 
        item={{ render: this.renderDetailRow, key: this.rowKey }}
        none={'--'}>
      </List>
      <div className='text-center'>
        <button className="btn btn-link" color="link" style={{margin:'0px auto'}}
          onClick={this.clickSave}>保存</button>
      </div>
    </>;
  });

  private clickSave = () => {
    this.controller.onSaveInit();
  }
}


const detailSchema: ItemSchema[] = [
  { name: 'id', type: 'id' } as IdSchema,
  { name: 'volume', type: 'number', required: true } as NumSchema,
  { name: 'price', type: 'number', required: true} as NumSchema,
  { name: 'submit', type: 'submit', },
];

export class VInitAccountEditDetail extends VPage<CAccountInit> {
  async open(param?: any) {
    this.openPage(this.page, param);
  }

  private detailUISchema: UiSchema = {
    items: {
      id: { widget: 'id',
        label: '股票',
        visible: true,
        placeholder: <small className="text-muted">请选择股票</small>,
        pickId: async (context: Context, name: string, value: number) => {
          let a = await this.controller.showSelectStock(context, name, value);
          context.setValue('price', a.price);
          return a;
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
      volume: { label: '数量', placeholder: '0.00' } as UiInputItem,
      price: { label: '价格', placeholder: '0.00' } as UiInputItem,
      submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
    }
  };


  render(param: any): JSX.Element {
    return <this.page />
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    this.controller.onUpdateDetailItem(context.data);
  }

  private page = observer((item?:any) => {
    return <Page header="添加明细" 
      headerClassName='bg-primary py-1 px-3'>
      <div className="px-3 py-3">
        <Form schema={detailSchema}
          uiSchema={this.detailUISchema}
          formData={item}
          onButtonClick={this.onFormButtonClick}
        />
      </div>
    </Page>;
  })
}
