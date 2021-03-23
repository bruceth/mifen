import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { StockValue } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	miValue: {
		"name": "miValue",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "MiValue"
	} as FieldItemInt,
	earning: {
		"name": "earning",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Earning"
	} as FieldItemInt,
	divident: {
		"name": "divident",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Divident"
	} as FieldItemInt,
	price: {
		"name": "price",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Price"
	} as FieldItemInt,
	pvolumn: {
		"name": "pvolumn",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Pvolumn"
	} as FieldItemInt,
	roe: {
		"name": "roe",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Roe"
	} as FieldItemInt,
	miRate: {
		"name": "miRate",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "MiRate"
	} as FieldItemInt,
	dvRate: {
		"name": "dvRate",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "DvRate"
	} as FieldItemInt,
	ttm: {
		"name": "ttm",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Ttm"
	} as FieldItemInt,
	inc1: {
		"name": "inc1",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Inc1"
	} as FieldItemInt,
	inc2: {
		"name": "inc2",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Inc2"
	} as FieldItemInt,
	inc3: {
		"name": "inc3",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Inc3"
	} as FieldItemInt,
	inc4: {
		"name": "inc4",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Inc4"
	} as FieldItemInt,
	preInc: {
		"name": "preInc",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "PreInc"
	} as FieldItemInt,
	volumn: {
		"name": "volumn",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Volumn"
	} as FieldItemInt,
	smoothness: {
		"name": "smoothness",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Smoothness"
	} as FieldItemInt,
	date: {
		"name": "date",
		"isKey": false,
		"label": "Date"
	} as undefined,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.miValue, fields.earning, fields.divident, fields.price, fields.pvolumn, fields.roe, fields.miRate, fields.dvRate, fields.ttm, fields.inc1, fields.inc2, fields.inc3, fields.inc4, fields.preInc, fields.volumn, fields.smoothness, fields.date, 
];

export const ui: UI = {
	label: "StockValue",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: StockValue):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
