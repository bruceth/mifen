import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { OrderMaster } from "./BzHelloTonva";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	no: {
		"name": "no",
		"type": "string",
		"isKey": true,
		"widget": "string",
		"label": "No"
	} as FieldItemString,
	customer: {
		"name": "customer",
		"type": "id",
		"isKey": false,
		"label": "Customer"
	} as FieldItemId,
	$owner: {
		"name": "$owner",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "$owner"
	} as FieldItemInt,
	$create: {
		"name": "$create",
		"isKey": false,
		"label": "$create"
	} as undefined,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.no, fields.customer, fields.$owner, fields.$create, 
];

export const ui: UI = {
	label: "OrderMaster",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: OrderMaster):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
