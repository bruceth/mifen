import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Holding } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	account: {
		"name": "account",
		"type": "id",
		"isKey": true,
		"label": "Account"
	} as FieldItemId,
	stock: {
		"name": "stock",
		"type": "id",
		"isKey": true,
		"label": "Stock"
	} as FieldItemId,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.account, fields.stock, 
];

export const ui: UI = {
	label: "Holding",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Holding):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
