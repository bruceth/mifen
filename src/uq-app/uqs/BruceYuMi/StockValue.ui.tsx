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
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "MiValue"
	} as FieldItemNum,
	incValue: {
		"name": "incValue",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "IncValue"
	} as FieldItemNum,
	earning: {
		"name": "earning",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Earning"
	} as FieldItemNum,
	divident: {
		"name": "divident",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Divident"
	} as FieldItemNum,
	price: {
		"name": "price",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Price"
	} as FieldItemNum,
	pvolumn: {
		"name": "pvolumn",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Pvolumn"
	} as FieldItemNum,
	roe: {
		"name": "roe",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Roe"
	} as FieldItemNum,
	inc1: {
		"name": "inc1",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Inc1"
	} as FieldItemNum,
	inc2: {
		"name": "inc2",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Inc2"
	} as FieldItemNum,
	inc3: {
		"name": "inc3",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Inc3"
	} as FieldItemNum,
	inc4: {
		"name": "inc4",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Inc4"
	} as FieldItemNum,
	preInc: {
		"name": "preInc",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "PreInc"
	} as FieldItemNum,
	volumn: {
		"name": "volumn",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Volumn"
	} as FieldItemNum,
	smoothness: {
		"name": "smoothness",
		"isKey": false,
		"widget": "updown",
		"label": "Smoothness"
	} as undefined,
	date: {
		"name": "date",
		"isKey": false,
		"label": "Date"
	} as undefined,
	miRate: {
		"name": "miRate",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "MiRate"
	} as FieldItemNum,
	dvRate: {
		"name": "dvRate",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "DvRate"
	} as FieldItemNum,
	ttm: {
		"name": "ttm",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Ttm"
	} as FieldItemNum,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.miValue, fields.incValue, fields.earning, fields.divident, fields.price, fields.pvolumn, fields.roe, fields.inc1, fields.inc2, fields.inc3, fields.inc4, fields.preInc, fields.volumn, fields.smoothness, fields.date, fields.miRate, fields.dvRate, fields.ttm, 
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
