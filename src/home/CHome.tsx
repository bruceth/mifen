/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { CApp, CUqBase } from '../UqApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';
import { CMarketPE } from './CMarketPE';
import { CStock } from 'stock';
import { Home } from './home';

export class CHome extends CUqBase {
	home: Home;
	//@observable warnings: any[] = [];

  /*
  disposeAutorun = autorun(async () => {
    let needLoad = false;
    let oldID = this.userTag && this.userTag.tagID;
    this.userTag = { tagName: this.cApp.config.tagName, tagID: this.cApp.tagID };
    if (oldID !== this.userTag.tagID) {
      needLoad = true;
    }

    let newSortType = this.cApp.config.userStock.sortType;
    if (this.oldSortType === undefined) {
      this.oldSortType = newSortType;
    }
    else if (this.oldSortType !== newSortType) {
      this.oldSortType = newSortType;
      needLoad = true;
    }

    if (needLoad) {
      await this.load();
    }
  });
  */
  	constructor(cApp: CApp) {
		super(cApp);
		let {store} = cApp;
		this.home = new Home(store);
	}

	load = async () => {
		await this.home.load();
	}

	onSelectTag = async () => {
		this.openVPage(VSelectTag);
	}

	onAddStock = async () => {
		let cStock = new CStock(this.cApp);
		let r = await cStock.call() as {id:number};

		if (r !== undefined) {
			await this.home.stockGroup.addStock(r.id);
		}
	}

	onClickTag = async (item:any) => {
		await this.cApp.store.selectTag(item);
		this.closePage();
	}

	onPage = async () => {
		//this.PageItems.more();
	}

	onWarningConfg = () => {
		this.cApp.cWarning.onWarningConfg();
	}


	// async searchMain(key: any) {
	//   if (key !== undefined) await this.PageItems.first(key);
	// }

		//作为tabs中的首页，internalStart不会被调用
	async internalStart(param: any) {
	}

	renderSiteHeader = () => {
		return this.renderView(VSiteHeader);
	}

	renderSearchHeader = (size?: string) => {
		return this.renderView(VSearchHeader, size);
	}

	tab = () => this.renderView(VHome);

	openStockInfo = (item: NStockInfo) => {
		let cStockInfo = this.newC(CStockInfo);
		cStockInfo.start(item);
	}

	openMarketPE = () => {
		let cm = this.newC(CMarketPE);
		cm.start();
	}

	setSortType = (type:string) => {
		//this.setSortType(type);
		alert('set sort type of home');
	}
}