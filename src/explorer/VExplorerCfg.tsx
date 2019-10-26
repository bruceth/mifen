/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, View, List, LMR, FA } from 'tonva';
import { NStockInfo } from '../stockinfo';
import { CExplorer } from './CExplorer';

export class VExplorerCfg extends VPage<CExplorer> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  sortChage = (event)=> {
    let newType = event.target.value;

    this.controller.cApp.setStockSortType(newType);
  }

  private page = observer(() => {
    let scfg = this.controller.cApp.findStockConfg;
    let findType = scfg.sortType;
    let a = 1;

    return <Page header="发现设置" headerClassName="bg-primary">
      <div className="px-3 py-2">排序</div>
      <div className="px-3 py-2">
        <label > <input type="radio" name="sortType" value="pe" checked={findType==="pe"}
          onChange={this.sortChage} />PE</label><br />
        <label > <input type="radio" name="sortType" value="dp" checked={findType==="dp"}
          onChange={this.sortChage} />分红率</label>
      </div>
    </Page>;
  })
}
