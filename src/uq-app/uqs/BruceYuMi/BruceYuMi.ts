//=== UqApp builder created on Thu Jan 06 2022 23:34:08 GMT-0500 (北美东部标准时间) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ bruce/yumi ========
//===============================

export interface Tuid$user {
	name: string;
	nick: string;
	icon: string;
	assigned: string;
	poke: number;
	timezone: number;
}

export interface Tuid$sheet {
	no: string;
	user: number;
	date: any;
	sheet: number;
	version: number;
	flow: number;
	app: number;
	state: number;
	discription: string;
	data: string;
	processing: number;
}

export interface ParamWriteStock {
	stocks: {
		market: string;
		no: string;
		name: string;
		rawId: number;
		incValue: number;
		earning: number;
		divident: number;
		roe: number;
		inc1: number;
		inc2: number;
		inc3: number;
		inc4: number;
		preInc: number;
		volumn: number;
		smoothness: number;
	}[];

}
interface ResultWriteStock {
}

export interface ParamWritePrice {
	prices: {
		market: string;
		no: string;
		name: string;
		rawId: number;
		price: number;
		pvolumn: number;
		date: number;
	}[];

}
interface ResultWritePrice {
}

export interface ParamWriteIndustryStock {
	industry: string;
	stocks: {
		rawId: number;
	}[];

}
interface ResultWriteIndustryStock {
}

export interface ParamWriteStockIndustry {
	rawId: number;
	industries: {
		industry: string;
	}[];

}
interface ResultWriteStockIndustry {
}

export interface ParamWriteGrossAndRevenue {
	stocks: {
		rawId: number;
		gIncValue: number;
		gInc1: number;
		gInc2: number;
		gInc3: number;
		gInc4: number;
		gPreInc: number;
		gSmoothness: number;
		rIncValue: number;
		rInc1: number;
		rInc2: number;
		rInc3: number;
		rInc4: number;
		rPreInc: number;
		rSmoothness: number;
	}[];

}
interface ResultWriteGrossAndRevenue {
}

export interface Param$setMyTimezone {
	_timezone: number;
}
interface Result$setMyTimezone {
}

export interface Param$poked {
}
interface Return$pokedRet {
	poke: number;
}
interface Result$poked {
	ret: Return$pokedRet[];
}

export interface ParamSearchStock {
	$orderSwitch: string;
	key: string;
	market: string;
	smooth: number;
}
interface ReturnSearchStock$page {
	$order: number;
	id: number;
	market: number;
	no: string;
	name: string;
	rawId: number;
	earning: number;
	divident: number;
	price: number;
	roe: number;
	volumn: number;
	dvRate: number;
	ttm: number;
	miRate: number;
	miValue: number;
	incValue: number;
	inc1: number;
	inc2: number;
	inc3: number;
	inc4: number;
	preInc: number;
	smoothness: number;
	gMiRate: number;
	gMiValue: number;
	gIncValue: number;
	gInc1: number;
	gInc2: number;
	gInc3: number;
	gInc4: number;
	gPreInc: number;
	gSmoothness: number;
	rMiRate: number;
	rMiValue: number;
	rIncValue: number;
	rInc1: number;
	rInc2: number;
	rInc3: number;
	rInc4: number;
	rPreInc: number;
	rSmoothness: number;
}
interface ResultSearchStock {
	$page: ReturnSearchStock$page[];
}

export interface ParamStockUsing {
	stock: number;
}
interface ReturnStockUsingAccounts {
	account: number;
}
interface ReturnStockUsingGroups {
	group: number;
}
interface ResultStockUsing {
	accounts: ReturnStockUsingAccounts[];
	groups: ReturnStockUsingGroups[];
}

export interface Param$getUnitTime {
}
interface Return$getUnitTimeRet {
	timezone: number;
	unitTimeZone: number;
	unitBizMonth: number;
	unitBizDate: number;
}
interface Result$getUnitTime {
	ret: Return$getUnitTimeRet[];
}

export interface Market {
	id?: number;
	name: string;
	currency: string;
}

export interface Transaction {
	id?: number;
	holding: number;
	tick: any;
	price: number;
	quantity: number;
	amount: number;
}

export interface Group {
	id?: number;
	no?: string;
	name: string;
}

export interface Account {
	id?: number;
	no?: string;
	name: string;
	portion: number;
}

export interface Holding {
	id?: number;
	account: number;
	stock: number;
	everBought: number;
}

export interface Stock {
	id?: number;
	market: number;
	no?: string;
	name: string;
	rawId: number;
	uno: string;
}

export interface Blog {
	id?: number;
	no?: string;
	caption: string;
	content: string;
	$create: Date;
}

export interface Industry {
	id?: number;
	name: string;
}

export interface StockValue {
	id: number;
	earning?: number;
	divident?: number;
	price?: number;
	pvolumn?: number;
	roe?: number;
	volumn?: number;
	date?: any;
	dvRate?: number;
	ttm?: number;
	miRate?: number;
	miValue?: number;
	incValue?: number;
	inc1?: number;
	inc2?: number;
	inc3?: number;
	inc4?: number;
	preInc?: number;
	smoothness?: number;
	gMiRate?: number;
	gMiValue?: number;
	gIncValue?: number;
	gInc1?: number;
	gInc2?: number;
	gInc3?: number;
	gInc4?: number;
	gPreInc?: number;
	gSmoothness?: number;
	rMiRate?: number;
	rMiValue?: number;
	rIncValue?: number;
	rInc1?: number;
	rInc2?: number;
	rInc3?: number;
	rInc4?: number;
	rPreInc?: number;
	rSmoothness?: number;
	$act?: number;
}

export interface AccountValue {
	id: number;
	miValue?: number;
	market?: number;
	count?: number;
	cash?: number;
	$act?: number;
}

export interface Portfolio {
	id: number;
	quantity?: number;
	cost?: number;
	$act?: number;
}

export interface ActParamStockValue {
	id: number | IDXValue;
	earning?: number | IDXValue;
	divident?: number | IDXValue;
	price?: number | IDXValue;
	pvolumn?: number | IDXValue;
	roe?: number | IDXValue;
	volumn?: number | IDXValue;
	date?: any | IDXValue;
	dvRate?: number | IDXValue;
	ttm?: number | IDXValue;
	miRate?: number | IDXValue;
	miValue?: number | IDXValue;
	incValue?: number | IDXValue;
	inc1?: number | IDXValue;
	inc2?: number | IDXValue;
	inc3?: number | IDXValue;
	inc4?: number | IDXValue;
	preInc?: number | IDXValue;
	smoothness?: number | IDXValue;
	gMiRate?: number | IDXValue;
	gMiValue?: number | IDXValue;
	gIncValue?: number | IDXValue;
	gInc1?: number | IDXValue;
	gInc2?: number | IDXValue;
	gInc3?: number | IDXValue;
	gInc4?: number | IDXValue;
	gPreInc?: number | IDXValue;
	gSmoothness?: number | IDXValue;
	rMiRate?: number | IDXValue;
	rMiValue?: number | IDXValue;
	rIncValue?: number | IDXValue;
	rInc1?: number | IDXValue;
	rInc2?: number | IDXValue;
	rInc3?: number | IDXValue;
	rInc4?: number | IDXValue;
	rPreInc?: number | IDXValue;
	rSmoothness?: number | IDXValue;
	$act?: number;
}

export interface ActParamAccountValue {
	id: number | IDXValue;
	miValue?: number | IDXValue;
	market?: number | IDXValue;
	count?: number | IDXValue;
	cash?: number | IDXValue;
	$act?: number;
}

export interface ActParamPortfolio {
	id: number | IDXValue;
	quantity?: number | IDXValue;
	cost?: number | IDXValue;
	$act?: number;
}

export interface UserBlockStock {
	ix: number;
	xi: number;
}

export interface UserAccount {
	ix: number;
	xi: number;
	sort: number;
}

export interface UserGroup {
	ix: number;
	xi: number;
}

export interface UserAllStock {
	ix: number;
	xi: number;
}

export interface AccountHolding {
	ix: number;
	xi: number;
}

export interface GroupStock {
	ix: number;
	xi: number;
	order: number;
}

export interface IXIndustry {
	ix: number;
	xi: number;
}

export interface ParamActs {
	market?: Market[];
	transaction?: Transaction[];
	group?: Group[];
	account?: Account[];
	holding?: Holding[];
	stock?: Stock[];
	blog?: Blog[];
	industry?: Industry[];
	stockValue?: ActParamStockValue[];
	accountValue?: ActParamAccountValue[];
	portfolio?: ActParamPortfolio[];
	userBlockStock?: UserBlockStock[];
	userAccount?: UserAccount[];
	userGroup?: UserGroup[];
	userAllStock?: UserAllStock[];
	accountHolding?: AccountHolding[];
	groupStock?: GroupStock[];
	iXIndustry?: IXIndustry[];
}


export interface UqExt extends Uq {
	Acts(param: ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	WriteStock: UqAction<ParamWriteStock, ResultWriteStock>;
	WritePrice: UqAction<ParamWritePrice, ResultWritePrice>;
	WriteIndustryStock: UqAction<ParamWriteIndustryStock, ResultWriteIndustryStock>;
	WriteStockIndustry: UqAction<ParamWriteStockIndustry, ResultWriteStockIndustry>;
	WriteGrossAndRevenue: UqAction<ParamWriteGrossAndRevenue, ResultWriteGrossAndRevenue>;
	$setMyTimezone: UqAction<Param$setMyTimezone, Result$setMyTimezone>;
	$poked: UqQuery<Param$poked, Result$poked>;
	SearchStock: UqQuery<ParamSearchStock, ResultSearchStock>;
	StockUsing: UqQuery<ParamStockUsing, ResultStockUsing>;
	$getUnitTime: UqQuery<Param$getUnitTime, Result$getUnitTime>;
	Market: UqID<any>;
	Transaction: UqID<any>;
	Group: UqID<any>;
	Account: UqID<any>;
	Holding: UqID<any>;
	Stock: UqID<any>;
	Blog: UqID<any>;
	Industry: UqID<any>;
	StockValue: UqIDX<any>;
	AccountValue: UqIDX<any>;
	Portfolio: UqIDX<any>;
	UserBlockStock: UqIX<any>;
	UserAccount: UqIX<any>;
	UserGroup: UqIX<any>;
	UserAllStock: UqIX<any>;
	AccountHolding: UqIX<any>;
	GroupStock: UqIX<any>;
	IXIndustry: UqIX<any>;
}
