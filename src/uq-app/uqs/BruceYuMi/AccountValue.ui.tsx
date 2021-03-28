import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { AccountValue } from "./BruceYuMi";

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
		"widget": "number",
		"label": "MiValue"
	} as FieldItemNum,
	market: {
		"name": "market",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Market"
	} as FieldItemNum,
	count: {
		"name": "count",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Count"
	} as FieldItemInt,
	cash: {
		"name": "cash",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Cash"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.miValue, fields.market, fields.count, fields.cash, 
];

export const ui: UI = {
	label: "AccountValue",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: AccountValue):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
