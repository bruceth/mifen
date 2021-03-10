//=== UqApp builder created on Mon Mar 01 2021 23:10:16 GMT-0500 (GMT-05:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


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
}

export interface Market {
	id?: number;
	name: string;
	currency: string;
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

export interface ParamIDActs {
	account?: Account[];
	holding?: Holding[];
	transaction?: Transaction[];
	stock?: Stock[];
	market?: Market[];
	portfolio?: Portfolio[];
	stockValue?: StockValue[];
	accountValue?: AccountValue[];
	userAccount?: UserAccount[];
}


export interface UqExt extends Uq {
	IDActs(param:ParamIDActs): Promise<any>;

	$user: UqTuid<Tuid$user>;
	$sheet: UqTuid<Tuid$sheet>;
	$poked: UqQuery<Param$poked, Result$poked>;
	Account: UqID<any>;
	Holding: UqID<any>;
	Transaction: UqID<any>;
	Stock: UqID<any>;
	Market: UqID<any>;
	Portfolio: UqIDX<any>;
	StockValue: UqIDX<any>;
	AccountValue: UqIDX<any>;
	UserAccount: UqIX<any>;
}
