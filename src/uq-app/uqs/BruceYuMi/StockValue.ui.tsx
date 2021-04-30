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
	volumn: {
		"name": "volumn",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Volumn"
	} as FieldItemNum,
	date: {
		"name": "date",
		"isKey": false,
		"label": "Date"
	} as undefined,
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
	miRate: {
		"name": "miRate",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "MiRate"
	} as FieldItemNum,
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
	smoothness: {
		"name": "smoothness",
		"isKey": false,
		"widget": "updown",
		"label": "Smoothness"
	} as undefined,
	gMiRate: {
		"name": "gMiRate",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GMiRate"
	} as FieldItemNum,
	gMiValue: {
		"name": "gMiValue",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GMiValue"
	} as FieldItemNum,
	gIncValue: {
		"name": "gIncValue",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GIncValue"
	} as FieldItemNum,
	gInc1: {
		"name": "gInc1",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GInc1"
	} as FieldItemNum,
	gInc2: {
		"name": "gInc2",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GInc2"
	} as FieldItemNum,
	gInc3: {
		"name": "gInc3",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GInc3"
	} as FieldItemNum,
	gInc4: {
		"name": "gInc4",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GInc4"
	} as FieldItemNum,
	gPreInc: {
		"name": "gPreInc",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "GPreInc"
	} as FieldItemNum,
	gSmoothness: {
		"name": "gSmoothness",
		"isKey": false,
		"label": "GSmoothness"
	} as undefined,
	rMiRate: {
		"name": "rMiRate",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RMiRate"
	} as FieldItemNum,
	rMiValue: {
		"name": "rMiValue",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RMiValue"
	} as FieldItemNum,
	rIncValue: {
		"name": "rIncValue",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RIncValue"
	} as FieldItemNum,
	rInc1: {
		"name": "rInc1",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RInc1"
	} as FieldItemNum,
	rInc2: {
		"name": "rInc2",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RInc2"
	} as FieldItemNum,
	rInc3: {
		"name": "rInc3",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RInc3"
	} as FieldItemNum,
	rInc4: {
		"name": "rInc4",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RInc4"
	} as FieldItemNum,
	rPreInc: {
		"name": "rPreInc",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "RPreInc"
	} as FieldItemNum,
	rSmoothness: {
		"name": "rSmoothness",
		"isKey": false,
		"label": "RSmoothness"
	} as undefined,
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
