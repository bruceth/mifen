import { action, makeObservable, observable } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { StockPageItems } from "./stockPageItems";
import { VTrack } from "./VTrack";
import { VStocksPage } from "./VStocksPage";
import { CGroup } from "./group";

type SearchOrder = 'miRateDesc' | 'miRateAsc' | 'dvRateDesc' | 'dvRateAsc' | 'roeDesc' | 'roeAsc';
const defaultSmooth = 0;
export interface SearchParam {
	key: string;
	market: string;
	$orderSwitch: SearchOrder;
	smooth: number;
    day: number;
}

export class CTrack extends CUqBase {
	readonly cGroup: CGroup;
	readonly cIndustries: CGroup;
	header: string = null;
	pageStocks: StockPageItems = null;
	searchOrder: SearchOrder = 'miRateDesc';
	searchParam: SearchParam;
	smooth: number;
    trackDay: number = 20100108;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			header: observable,
			smooth: observable,
            trackDay: observable,
			loadSmooth: action,
			changeSmooth: action,
		});

        let ltd = localStorage.getItem('_trackday');
        if (ltd !== undefined && ltd !== null) {
            let d = parseInt(ltd);
            if (d >= 20050101 && d < 40000000) {
                this.trackDay = d;
            }
        }
        
		this.cGroup = this.newSub(CGroup);
		this.cIndustries = this.newSub(CGroup);
		this.loadSmooth();
	}

	tab = () => {
		return this.renderView(VTrack);
	}

	async internalStart(param: any) {
		this.openVPage(VTrack);
	}

	loadSmooth() {
		let t = localStorage.getItem('smooth');
		if (!t) this.smooth = defaultSmooth;
		else {
			try {
				this.smooth = Number.parseInt(t);
			}
			catch {
				this.smooth = defaultSmooth;
			}
		}
	}

	async changeSmooth(value: number) {
		if (this.smooth === value) return;
		this.smooth = value;
		localStorage.setItem('smooth', String(value));
		this.searchParam['smooth'] = value;
		await this.research();
	}

	load = async () => { }

	async research() {
		await this.pageStocks.first(this.searchParam);
	}

	private async searchStock(header: string, market?: string[], key?: string) {
		this.header = header;
		this.searchParam = {
            day: this.trackDay,
			key,
			market: market?.join('\n'),
			$orderSwitch: this.searchOrder,
			smooth: key ? 0 : this.smooth,
		};
		this.pageStocks = new StockPageItems(this.cApp.store);
		await this.pageStocks.first(this.searchParam);
		this.openVPage(VStocksPage);
	}

    private async reLoadPageStocks() {
        this.searchParam.day = this.trackDay;
		await this.pageStocks.first(this.searchParam);
    }

    onSetTrackDay = async (key: string) => {
        let day = parseInt(key);
        if (day === undefined || isNaN(day) || day < 20050100) {
            day = 20050101;
        }
        let days = await this.cApp.store.getNextTradedays(day) as {day: number}[];
        if (Array.isArray(days) && days.length > 0) {
            day = days[0].day;
            let y = Math.floor(day / 10000);
            let m = Math.floor((day % 10000) / 100);
            let d = Math.floor(day % 100);
            let date = new Date(y, m - 1, d);
            let w = date.getDay();
            let dif = 0;
            if (w === 5) {
            }
            else {
                if (w === 6) {
                    dif = 6;
                }
                else {
                    dif = 5 - w;
                }
                date.setTime(date.valueOf() + dif * 86400000);
                y = date.getFullYear();
                m = date.getMonth() + 1;
                d = date.getDate();
            }
        
            let fday = y * 10000 + m * 100 + d;
            if (fday > day) {
                let ni = 1;
                let length = days.length;
                while (ni < length) {
                    let nitem = days[ni];
                    let nday = nitem.day;
                    if (nday > fday) {
                        break;
                    }
                    day = nday;
                    if (day === fday) {
                        break;
                    }
                    ni++;
                }
            }
                
        }

        if (this.trackDay === day) {
            return;
        }
        this.trackDay = day;
        localStorage.setItem('_trackday', String(this.trackDay));
    }

    onNextTrackDay = async() => {
        let keyDay = this.trackDay;
        if (keyDay === undefined) {
            keyDay = 20050101;
        }
        else {
            keyDay = keyDay + 1;
        }

        await this.onSetTrackDay(keyDay.toString());
    }

    onNextTrackDayAndReload = async() => {
        let keyDay = this.trackDay;
        if (keyDay === undefined) {
            keyDay = 20050101;
        }
        else {
            keyDay = keyDay + 1;
        }

        let oldDay = this.trackDay;
        await this.onSetTrackDay(keyDay.toString());
        if (this.trackDay !== oldDay) {
            await this.reLoadPageStocks();
        }
    }

	onSearch = async (key: string) => {
		await this.searchStock('搜索', ['sh', 'sz', 'bj'], key);
	}

	showA = async () => {
		await this.searchStock('A股', ['sh', 'sz', 'bj']);
	}
	showSH = async () => {
		await this.searchStock('沪股', ['sh']);
	}
	showSZ = async () => {
		await this.searchStock('深股', ['sz']);
	}
	showBJ = async () => {
		await this.searchStock('京股', ['bj']);
	}
	showAll = async () => {
		await this.searchStock('全部股票', ['sh', 'sz', 'bj']);
	}

    showMirateAvg = () => {
        this.cApp.showMirateAvg(this.trackDay);
    }

	onClickStock = (stock: Stock & StockValue) => {

	}
}
