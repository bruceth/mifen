/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { CApp, CUqBase } from "../uq-app";
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VExplorer } from './VExplorer';
import { VExplorerCfg } from './VExplorerCfg';
import { PredictHistoryParam } from 'predicthistory/CPredictHistory';
import { Explore } from './explore';

export class CExplorer extends CUqBase {
	explore: Explore;

	constructor(cApp: CApp) {
		super(cApp);
		let {store} = cApp;
		this.explore = new Explore(store);
	}

	load = async () => {
		this.explore.load();
	}

	onPage = async () => {
		//this.PageItems.more();
	}

	onConfig = async () => {
		this.openVPage(VExplorerCfg);
	}

	async internalStart(param: any) {
	}

	onSelectItem = async (item:any, isSelected:boolean) => {
		if (isSelected === true) {
			this.explore.onItemSelected(item);
		}
		else {
			this.explore.onItemUnselected(item);
		}
	}

	setSortType = (type:string) => this.explore.setSortType(type);

	renderSiteHeader = () => {
		return this.renderView(VSiteHeader);
	}

	renderHome = () => {
		return this.renderView(VExplorer);
	}


	openMetaView = () => {}

	tab = () => this.renderHome();

	openStockInfo = (item: NStockInfo) => {
		let cStockInfo = this.newC(CStockInfo);
		cStockInfo.start(item);
	}

	onClickPredictAVG = () => {
		let {avgs, lastTradeDay} = this.explore;
		let param: PredictHistoryParam = {
		  day:undefined,
		  priceDay:lastTradeDay,
		  avg20:avgs.avg20,
		  avg50:avgs.avg50,
		  avg100:avgs.avg100,
		  avg:avgs.avg,
		}
		this.cApp.openPredictAVG(param);
	}
}
