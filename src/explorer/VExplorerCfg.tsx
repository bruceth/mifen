/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { CExplorer } from './CExplorer';

export class VExplorerCfg extends VPage<CExplorer> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  sortChage = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.setStockSortType(newType);
  }

  selectChage = (e)=> {
    let newType = e.target.value;

    this.controller.cApp.setStockSelectType(newType);
  }

  private page = observer(() => {
    let scfg = this.controller.cApp.findStockConfg;
    //let findType = scfg.sortType;
    let selectType = scfg.selectType;
    if (selectType === undefined) {
      selectType = 'dvperoe';
    }
    let a = 1;

    return <Page header="选股设置" headerClassName="bg-primary">
      <div className="px-3 py-2">方法</div>
      <div className="px-3 py-2 d-flex flex-wrap">
        <label className="px-3 c8"> <input type="radio" name="selectType" value="dvperoe" checked={selectType==="dvperoe"}
          onChange={this.selectChage} />综合一</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="peroe" checked={selectType==="peroe"}
          onChange={this.selectChage} />神奇公式</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="pe" checked={selectType==="pe"}
          onChange={this.selectChage} />PE</label><br />
        <label className="px-3 c8"> <input type="radio" name="selectType" value="dp" checked={selectType==="dp"}
          onChange={this.selectChage} />股息率</label>
      </div>
    </Page>;
  })
}
