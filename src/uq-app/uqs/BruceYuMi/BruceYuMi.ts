//=== UqApp builder created on Wed Apr 07 2021 14:53:42 GMT-0400 (GMT-04:00) ===//
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
	miValue: number;
	incValue: number;
	earning: number;
	divident: number;
	price: number;
	roe: number;
	inc1: number;
	inc2: number;
	inc3: number;
	inc4: number;
	preInc: number;
	volumn: number;
	smoothness: number;
	miRate: number;
	dvRate: number;
	ttm: number;
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

export interface ParamSearchStock1 {
	key: string;
}
interface ReturnSearchStock1$page {
	id: number;
}
interface ResultSearchStock1 {
	$page: ReturnSearchStock1$page[];
}

export interface $Piecewise {
	id?: number;
	name: string;
	mul: number;
	div: number;
	offset: number;
	asc: number;
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
}

export interface $PiecewiseDetail {
	id?: number;
	parent: number;
	row?: number;
	sec: number;
	value: number;
}

export interface Stock {
	id?: number;
	market: number;
	no?: string;
	name: string;
	rawId: number;
}

export interface Blog {
	id?: number;
	no?: string;
	caption: string;
	content: string;
	$owner?: number;
	$create?: any;
	$update?: any;
}

export interface StockValue {
	id: number;
	miValue?: number;
	incValue?: number;
	earning?: number;
	divident?: number;
	price?: number;
	pvolumn?: number;
	roe?: number;
	inc1?: number;
	inc2?: number;
	inc3?: number;
	inc4?: number;
	preInc?: number;
	volumn?: number;
	smoothness?: number;
	date?: any;
	miRate?: number;
	dvRate?: number;
	ttm?: number;
	$act?: number;
}

export interface AccountValue {
	id: number;
	miValue?: number;
	market?: number;
	count?: number;
	cash?: number;
	$act?: number;
	$track?: number;
}

export interface Portfolio {
	id: number;
	quantity?: number;
	cost?: number;
	$act?: number;
	$track?: number;
}

export interface ActParamStockValue {
	id: number|IDXValue;
	miValue?: number|IDXValue;
	incValue?: number|IDXValue;
	earning?: number|IDXValue;
	divident?: number|IDXValue;
	price?: number|IDXValue;
	pvolumn?: number|IDXValue;
	roe?: number|IDXValue;
	inc1?: number|IDXValue;
	inc2?: number|IDXValue;
	inc3?: number|IDXValue;
	inc4?: number|IDXValue;
	preInc?: number|IDXValue;
	volumn?: number|IDXValue;
	smoothness?: number|IDXValue;
	date?: any|IDXValue;
	miRate?: number|IDXValue;
	dvRate?: number|IDXValue;
	ttm?: number|IDXValue;
	$act?: number;
}

export interface ActParamAccountValue {
	id: number|IDXValue;
	miValue?: number|IDXValue;
	market?: number|IDXValue;
	count?: number|IDXValue;
	cash?: number|IDXValue;
	$act?: number;
	$track?: number;
}

export interface ActParamPortfolio {
	id: number|IDXValue;
	quantity?: number|IDXValue;
	cost?: number|IDXValue;
	$act?: number;
	$track?: number;
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

export interface ParamActs {
	$Piecewise?: $Piecewise[];
	market?: Market[];
	transaction?: Transaction[];
	group?: Group[];
	account?: Account[];
	holding?: Holding[];
	$PiecewiseDetail?: $PiecewiseDetail[];
	stock?: Stock[];
	blog?: Blog[];
	stockValue?: ActParamStockValue[];
	accountValue?: ActParamAccountValue[];
	portfolio?: ActParamPortfolio[];
	userBlockStock?: UserBlockStock[];
	userAccount?: UserAccount[];
	userGroup?: UserGroup[];
	userAllStock?: UserAllStock[];
	accountHolding?: AccountHolding[];
	groupStock?: GroupStock[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	WriteStock: UqAction<ParamWriteStock, ResultWriteStock>;
	WritePrice: UqAction<ParamWritePrice, ResultWritePrice>;
	$poked: UqQuery<Param$poked, Result$poked>;
	SearchStock: UqQuery<ParamSearchStock, ResultSearchStock>;
	StockUsing: UqQuery<ParamStockUsing, ResultStockUsing>;
	SearchStock1: UqQuery<ParamSearchStock1, ResultSearchStock1>;
	$Piecewise: UqID<any>;
	Market: UqID<any>;
	Transaction: UqID<any>;
	Group: UqID<any>;
	Account: UqID<any>;
	Holding: UqID<any>;
	$PiecewiseDetail: UqID<any>;
	Stock: UqID<any>;
	Blog: UqID<any>;
	StockValue: UqIDX<any>;
	AccountValue: UqIDX<any>;
	Portfolio: UqIDX<any>;
	UserBlockStock: UqIX<any>;
	UserAccount: UqIX<any>;
	UserGroup: UqIX<any>;
	UserAllStock: UqIX<any>;
	AccountHolding: UqIX<any>;
	GroupStock: UqIX<any>;
}
