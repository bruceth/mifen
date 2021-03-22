//=== UqApp builder created on Mon Mar 22 2021 00:24:23 GMT-0400 (GMT-04:00) ===//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IDXValue, Uq, UqTuid, UqQuery, UqID, UqIDX, UqIX } from "tonva-react";


//===============================
//======= UQ BizDev/hello-tonva ========
//===============================

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

export interface Tuid$user {
	name: string;
	nick: string;
	icon: string;
	assigned: string;
	poke: number;
}

export interface Param$poked {
}
interface Return$pokedRet {
	poke: number;
	$id: number;
}
interface Result$poked {
	ret: Return$pokedRet[];
}

export interface Customer {
	id?: number;
	no?: string;
	firstName: string;
	lastName: string;
}

export interface OrderMaster {
	id?: number;
	no?: string;
	customer: number;
	$owner?: number;
	$create?: any;
}

export interface OrderDetail {
	id?: number;
	parent: number;
	row?: number;
	product: number;
	price: number;
	quantity: number;
	amount: number;
}

export interface Tag {
	id?: number;
	parent: number;
	name: string;
}

export interface Staff {
	id?: number;
	no?: string;
	firstName: string;
	lastName: string;
}

export interface $Piecewise {
	id?: number;
	name: string;
	mul: number;
	div: number;
	offset: number;
	asc: number;
}

export interface $PiecewiseDetail {
	id?: number;
	parent: number;
	row?: number;
	sec: number;
	value: number;
}

export interface Achieve {
	id: number;
	saleAmount?: number;
	deliver?: number;
}

export interface Hours {
	id: number;
	onsite?: number;
	offsite?: number;
	break?: number;
	sick?: number;
	over?: number;
	noTimeLog?: number;
}

export interface ActParamAchieve {
	id: number|IDXValue;
	saleAmount?: number|IDXValue;
	deliver?: number|IDXValue;
}

export interface ActParamHours {
	id: number|IDXValue;
	onsite?: number|IDXValue;
	offsite?: number|IDXValue;
	break?: number|IDXValue;
	sick?: number|IDXValue;
	over?: number|IDXValue;
	noTimeLog?: number|IDXValue;
}

export interface CustomerTag {
	ix: number;
	id: number;
}

export interface UserStaff {
	ix: number;
	id: number;
}

export interface ParamActs {
	customer?: Customer[];
	orderMaster?: OrderMaster[];
	orderDetail?: OrderDetail[];
	tag?: Tag[];
	staff?: Staff[];
	$Piecewise?: $Piecewise[];
	$PiecewiseDetail?: $PiecewiseDetail[];
	achieve?: ActParamAchieve[];
	hours?: ActParamHours[];
	customerTag?: CustomerTag[];
	userStaff?: UserStaff[];
}


export interface UqExt extends Uq {
	Acts(param:ParamActs): Promise<any>;

	$sheet: UqTuid<Tuid$sheet>;
	$user: UqTuid<Tuid$user>;
	$poked: UqQuery<Param$poked, Result$poked>;
	Customer: UqID<any>;
	OrderMaster: UqID<any>;
	OrderDetail: UqID<any>;
	Tag: UqID<any>;
	Staff: UqID<any>;
	$Piecewise: UqID<any>;
	$PiecewiseDetail: UqID<any>;
	Achieve: UqIDX<any>;
	Hours: UqIDX<any>;
	CustomerTag: UqIX<any>;
	UserStaff: UqIX<any>;
}
