import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Transaction } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	holding: {
		"name": "holding",
		"type": "id",
		"isKey": true,
		"label": "Holding"
	} as FieldItemId,
	tick: {
		"name": "tick",
		"isKey": true,
		"label": "Tick"
	} as undefined,
	price: {
		"name": "price",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Price"
	} as FieldItemInt,
	quantity: {
		"name": "quantity",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Quantity"
	} as FieldItemInt,
	amount: {
		"name": "amount",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Amount"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.holding, fields.tick, fields.price, fields.quantity, fields.amount, 
];

export const ui: UI = {
	label: "Transaction",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: Transaction):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
