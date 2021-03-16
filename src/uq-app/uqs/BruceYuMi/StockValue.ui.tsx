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
	miRate: {
		"name": "miRate",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "MiRate"
	} as FieldItemInt,
	ttm: {
		"name": "ttm",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Ttm"
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
	roe: {
		"name": "roe",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Roe"
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
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.miRate, fields.ttm, fields.divident, fields.price, fields.roe, fields.inc1, fields.inc2, fields.inc3, fields.inc4, fields.preInc, fields.volumn, 
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
