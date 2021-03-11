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
	mi: {
		"name": "mi",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Mi"
	} as FieldItemInt,
	market: {
		"name": "market",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Market"
	} as FieldItemInt,
	count: {
		"name": "count",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Count"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.mi, fields.market, fields.count, 
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
