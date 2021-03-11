import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Market } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	name: {
		"name": "name",
		"type": "string",
		"isKey": true,
		"widget": "string",
		"label": "Name"
	} as FieldItemString,
	currency: {
		"name": "currency",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "Currency"
	} as FieldItemString,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.name, fields.currency, 
];

export const ui: UI = {
	label: "Market",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Market):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
