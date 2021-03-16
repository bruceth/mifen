//import { ID } from "tonva-react";

export interface IDBase {
	id?: number;
}

export interface IXBase extends IDBase {
	ix: number;
}

export interface Master {
	id?: number;
}

export interface Detail {
	id?: number;
	master?: number;
	row?: number;
}
