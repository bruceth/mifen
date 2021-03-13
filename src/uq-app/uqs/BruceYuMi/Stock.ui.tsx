import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Stock } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	market: {
		"name": "market",
		"type": "id",
		"isKey": true,
		"label": "Market"
	} as FieldItemId,
	code: {
		"name": "code",
		"type": "string",
		"isKey": true,
		"widget": "string",
		"label": "Code"
	} as FieldItemString,
	name: {
		"name": "name",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "Name"
	} as FieldItemString,
	search: {
		"name": "search",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "Search"
	} as FieldItemString,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.market, fields.code, fields.name, fields.search, 
];

export const ui: UI = {
	label: "Stock",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Stock):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
