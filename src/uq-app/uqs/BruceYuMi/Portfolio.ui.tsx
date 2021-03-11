import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Portfolio } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	quantity: {
		"name": "quantity",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Quantity"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.quantity, 
];

export const ui: UI = {
	label: "Portfolio",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Portfolio):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
