//=== UqApp builder created on Sun Mar 14 2021 12:25:48 GMT-0400 (GMT-04:00) ===//
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
		miRate: number;
		ttm: number;
		divident: number;
		price: number;
		roe: number;
		inc1: number;
		inc2: number;
		inc3: number;
		inc4: number;
		preInc: number;
		marketValue: number;
	}[];

}
interface ResultWriteStock {
}

export interface Param$poked {
}
interface Return$pokedRet {
	poke: number;
}
interface Result$poked {
	ret: Return$pokedRet[];
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

export interface Transaction {
	id?: number;
	holding: number;
	tick: any;
	price: number;
	quantity: number;
	amount: number;
}

export interface Stock {
	id?: number;
	market: number;
	code: string;
	name: string;
	search: string;
}

export interface Market {
	id?: number;
	name: string;
	currency: string;
}

export interface $PiecewiseDetail {
	id?: number;
	parent: number;
	row?: number;
	sec: number;
	value: number;
}

export interface $Piecewise {
	id?: number;
	name: string;
	mul: number;
	div: number;
	offset: number;
	asc: number;
}

export interface Group {
	id?: number;
	no?: string;
	name: string;
	type: any;
}

export interface Portfolio {
	id: number;
	quantity?: number|IDXValue;
	$track?: number;
}

export interface StockValue {
	id: number;
	miRate?: number;
	ttm?: number|IDXValue;
	divident?: number|IDXValue;
	price?: number|IDXValue;
	roe?: number|IDXValue;
	inc1?: number|IDXValue;
	inc2?: number|IDXValue;
	inc3?: number|IDXValue;
	inc4?: number|IDXValue;
	preInc?: number;
	marketValue?: number;
}

export interface AccountValue {
	id: number;
	mi?: number|IDXValue;
	market?: number|IDXValue;
	count?: number|IDXValue;
}

export interface UserAccount {
	id: number;
	id2: number;
}

export interface UserGroup {
	id: number;
	id2: number;
}

export interface GroupStock {
	id: number;
	id2: number;
	order: number;
}

export interface ParamActs {
	account?: Account[];
	holding?: Holding[];
	transaction?: Transaction[];
	stock?: Stock[];
	market?: Market[];
	$PiecewiseDetail?: $PiecewiseDetail[];
	$Piecewise?: $Piecewise[];
	group?: Group[];
	portfolio?: Portfolio[];
	stockValue?: StockValue[];
	accountValue?: AccountValue[];
	userAccount?: UserAccount[];
	userGroup?: UserGroup[];
	groupStock?: GroupStock[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	WriteStock: UqAction<ParamWriteStock, ResultWriteStock>;
	$poked: UqQuery<Param$poked, Result$poked>;
	Account: UqID<any>;
	Holding: UqID<any>;
	Transaction: UqID<any>;
	Stock: UqID<any>;
	Market: UqID<any>;
	$PiecewiseDetail: UqID<any>;
	$Piecewise: UqID<any>;
	Group: UqID<any>;
	Portfolio: UqIDX<any>;
	StockValue: UqIDX<any>;
	AccountValue: UqIDX<any>;
	UserAccount: UqIX<any>;
	UserGroup: UqIX<any>;
	GroupStock: UqIX<any>;
}
