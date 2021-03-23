//=== UqApp builder created on Mon Mar 22 2021 16:22:57 GMT-0400 (GMT-04:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqAction, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ bruce/yumi ========
//===============================

export enum EnumGroupType {
	normal = 0,
	black = -1,
	all = 1
}

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
		code: string;
		name: string;
		rawId: number;
		miValue: number;
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
		code: string;
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
	key: string;
	market: string;
	orderSwitch: string;
}
interface ReturnSearchStock$page {
	id: number;
	market: string;
	currency: string;
	code: string;
	name: string;
	rawId: number;
	miValue: number;
	earning: number;
	divident: number;
	price: number;
	roe: number;
	miRate: number;
	dvRate: number;
	inc1: number;
	inc2: number;
	inc3: number;
	inc4: number;
	preInc: number;
	volumn: number;
	smoothness: number;
	$id: number;
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
	type: any;
}

export interface Account {
	id?: number;
	no?: string;
	name: string;
}

export interface Holding {
	id?: number;
	account: number;
	stock: number;
	order: number;
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
	code: string;
	name: string;
	search: string;
	rawId: number;
}

export interface StockValue {
	id: number;
	miValue?: number;
	earning?: number;
	divident?: number;
	price?: number;
	pvolumn?: number;
	roe?: number;
	miRate?: number;
	dvRate?: number;
	inc1?: number;
	inc2?: number;
	inc3?: number;
	inc4?: number;
	preInc?: number;
	volumn?: number;
	smoothness?: number;
	date?: any;
}

export interface AccountValue {
	id: number;
	mi?: number;
	market?: number;
	count?: number;
	cash?: number;
	$track?: number;
}

export interface Portfolio {
	id: number;
	quantity?: number;
	$track?: number;
}

export interface ActParamStockValue {
	id: number|IDXValue;
	miValue?: number|IDXValue;
	earning?: number|IDXValue;
	divident?: number|IDXValue;
	price?: number|IDXValue;
	pvolumn?: number|IDXValue;
	roe?: number|IDXValue;
	miRate?: number|IDXValue;
	dvRate?: number|IDXValue;
	inc1?: number|IDXValue;
	inc2?: number|IDXValue;
	inc3?: number|IDXValue;
	inc4?: number|IDXValue;
	preInc?: number|IDXValue;
	volumn?: number|IDXValue;
	smoothness?: number|IDXValue;
	date?: any|IDXValue;
}

export interface ActParamAccountValue {
	id: number|IDXValue;
	mi?: number|IDXValue;
	market?: number|IDXValue;
	count?: number|IDXValue;
	cash?: number|IDXValue;
	$track?: number;
}

export interface ActParamPortfolio {
	id: number|IDXValue;
	quantity?: number|IDXValue;
	$track?: number;
}

export interface UserBlockStock {
	ix: number;
	id: number;
}

export interface UserAccount {
	ix: number;
	id: number;
}

export interface UserGroup {
	ix: number;
	id: number;
}

export interface UserAllStock {
	ix: number;
	id: number;
}

export interface AccountHolding {
	ix: number;
	id: number;
}

export interface GroupStock {
	ix: number;
	id: number;
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
	$Piecewise: UqID<any>;
	Market: UqID<any>;
	Transaction: UqID<any>;
	Group: UqID<any>;
	Account: UqID<any>;
	Holding: UqID<any>;
	$PiecewiseDetail: UqID<any>;
	Stock: UqID<any>;
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
