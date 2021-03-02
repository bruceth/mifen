/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable } from 'mobx';
import { PageItems } from 'tonva-react';
import { CUqBase } from '../UqApp';
import { VStockSelect } from './VSelectStock';

class PageStockItems<T> extends PageItems<T> {
  cStock: CStock;

  constructor(cs: CStock) {
      super(true);
      this.cStock = cs;
      this.firstSize = this.pageSize = 30;
  }

  protected async loadResults(param: any, pageStart: any, pageSize: number): Promise<{
	[name: string]: any[];
	}> {
      if (pageStart === undefined) pageStart = 0;
      let p = ['%' + param.key + '%'];
      try {
        let ret = await this.cStock.cApp.miApi.page('q_stocks$page', p, pageStart, pageSize);
        return ret;
      }
      catch (error) {
        let e = error;
        return undefined;
      }
  }

  protected setPageStart(item: any): any {
      this.pageStart = item === undefined ? 0 : item.id;
  }
}

export class CStock extends CUqBase {
  @observable pageItems: PageStockItems<any> = new PageStockItems<any>(this);

  //get cApp(): CMiApp { return this._cApp as CMiApp };

  async internalStart(param: any) {
    this.openVPage(VStockSelect);
}

  searchByKey = async (key: string) => {
    this.pageItems = new PageStockItems<any>(this);
    this.pageItems.first({ key: key });
  }

  //给调用页面返回id
  returnStock = async (item: any): Promise<any> => {
    this.returnCall(item);
  }

  onPage = async () => {
    await this.pageItems.more();
  }
}