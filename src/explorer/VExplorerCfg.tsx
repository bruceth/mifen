/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR, UiSelect, UiTextItem } from 'tonva-react';
import { CExplorer } from './CExplorer';

const schema: ItemSchema[] = [
  { name: 'irate', type: 'number', required: true},
  { name: 'bmin', type: 'number', required: true},
  { name: 'bmax', type: 'number', required: true},
  { name: 'r2', type: 'number', required: true},
  { name: 'lmin', type: 'number', required: true},
  { name: 'lmax', type: 'number', required: true},
  { name: 'lr2', type: 'number', required: true},
  { name: 'mcount', type: 'integer', required: true},
  { name: 'lr4', type: 'number', required: true},
  { name: 'r210', type: 'number', required: true},
  { name: 'submit', type: 'submit', },
];

const uiSchema: UiSchema = {
  items: {
    irate: { widget: 'number', label: '无风险收益率', placeholder: '0.04'} as UiInputItem,
    bmin: { widget: 'number', label: '指数回归最小值', placeholder: '0.00'} as UiInputItem,
    bmax: { widget: 'number', label: '指数回归最大值', placeholder: '0.00'} as UiInputItem,
    r2: { widget: 'number', label: '指数回归R2', placeholder: '0.00'} as UiInputItem,
    lmin: { widget: 'number', label: '线性回归最小值', placeholder: '0.00'} as UiInputItem,
    lmax: { widget: 'number', label: '线性回归最大值', placeholder: '0.00'} as UiInputItem,
    lr2: { widget: 'number', label: '线性回归R2', placeholder: '0.00'} as UiInputItem,
    lr4: { widget: 'number', label: '末年与前4年均值最大比值', placeholder: '0.00'} as UiInputItem,
    mcount: { widget: 'number', label: '5年内单季亏损最多允许出现次数', placeholder: '0.00'} as UiInputItem,
    r210: { widget: 'number', label: '十年回归R2', placeholder: '0.00'} as UiInputItem,
    submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
  }
};


export class VExplorerCfg extends VPage<CExplorer> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  sortChage = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.store.setStockSortType(newType);
  }

  selectChange = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.store.setStockSelectType(newType);
  }

  onChange = (e) => {
    let {name, value} = e.target;
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    //await this.controller.onSaveNewWarning(context.data);
    let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, irate} = context.data;
    let cfg = {bmin:bmin, bmax:bmax, r2:r2, lmin:lmin, lmax:lmax, lr2:lr2, mcount:mcount, lr4:lr4, r210:r210, irate:irate};
    await this.controller.cApp.store.setRegressionConfig(cfg);
    this.controller.closePage();
  }


  private page = observer(() => {
    let scfg = this.controller.cApp.store.findStockConfg;
    //let findType = scfg.sortType;
    // let selectType = scfg.selectType;
    // if (selectType === undefined) {
    //   selectType = 'all';
    // }
    let fData = this.controller.cApp.store.config.regression;
    if (fData.irate === undefined)
      fData.irate = 0.04;

    return <Page header="选股设置" headerClassName="bg-primary">
      {/* <div className="px-3 py-2">方法</div>
      <div className="px-3 py-2 d-flex flex-wrap">
        <label className="px-3 c8"> <input type="radio" name="selectType" value="all" checked={selectType==="all"}
          onChange={this.selectChange} />预期PE</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="value" checked={selectType==="value"}
          onChange={this.selectChange} />价值指数</label><br />
      </div> */}
      <div className="px-3 py-2">回归参数</div>
      <Form schema={schema}
          uiSchema={uiSchema}
          formData={fData}
          onButtonClick={this.onFormButtonClick}
        />
    </Page>;
  })
}
