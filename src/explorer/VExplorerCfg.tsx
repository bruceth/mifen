/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, UiSelect, UiTextItem } from 'tonva';
import { CExplorer } from './CExplorer';

const schema: ItemSchema[] = [
  { name: 'bmin', type: 'number', required: true},
  { name: 'bmax', type: 'number', required: true},
  { name: 'r2', type: 'number', required: true},
  { name: 'lmin', type: 'number', required: true},
  { name: 'lmax', type: 'number', required: true},
  { name: 'lr2', type: 'number', required: true},
  { name: 'mcount', type: 'integer', required: true},
  { name: 'lr4', type: 'integer', required: true},
  { name: 'submit', type: 'submit', },
];

const uiSchema: UiSchema = {
  items: {
    bmin: { widget: 'text', label: '指数回归最小值', placeholder: '0.00'} as UiTextItem,
    bmax: { widget: 'text', label: '指数回归最大值', placeholder: '0.00'} as UiTextItem,
    r2: { widget: 'text', label: '指数回归R2', placeholder: '0.00'} as UiTextItem,
    lmin: { widget: 'text', label: '线性回归最小值', placeholder: '0.00'} as UiTextItem,
    lmax: { widget: 'text', label: '线性回归最大值', placeholder: '0.00'} as UiTextItem,
    lr2: { widget: 'text', label: '线性回归R2', placeholder: '0.00'} as UiTextItem,
    lr4: { widget: 'text', label: '末年与前4年均值最大比值', placeholder: '0.00'} as UiTextItem,
    mcount: { widget: 'text', label: '5年内单季亏损最多允许出现次数', placeholder: '0.00'} as UiTextItem,
    submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
  }
};


export class VExplorerCfg extends VPage<CExplorer> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  sortChage = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.setStockSortType(newType);
  }

  selectChange = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.setStockSelectType(newType);
  }

  onChange = (e) => {
    let {name, value} = e.target;
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    //await this.controller.onSaveNewWarning(context.data);
    let data = context.data;
  }


  private page = observer(() => {
    let scfg = this.controller.cApp.findStockConfg;
    //let findType = scfg.sortType;
    let selectType = scfg.selectType;
    if (selectType === undefined) {
      selectType = 'dvperoe';
    }
    let fData = {bmin:0, bmax:0.5, r2:0.6, lmin:0.01, lmax:0.5, lr2:0.6, mcount:2, lr4: 2};

    return <Page header="选股设置" headerClassName="bg-primary">
      <div className="px-3 py-2">方法</div>
      <div className="px-3 py-2 d-flex flex-wrap">
        <label className="px-3 c8"> <input type="radio" name="selectType" value="dvperoe" checked={selectType==="dvperoe"}
          onChange={this.selectChange} />综合</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="peroe" checked={selectType==="peroe"}
          onChange={this.selectChange} />神奇公式</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="pe" checked={selectType==="pe"}
          onChange={this.selectChange} />PE</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="dp" checked={selectType==="dp"}
          onChange={this.selectChange} />股息率</label>
      </div>
      <div className="px-3 py-2">回归参数</div>
      <Form schema={schema}
          uiSchema={uiSchema}
          formData={fData}
          onButtonClick={this.onFormButtonClick}
        />
    </Page>;
  })
}
