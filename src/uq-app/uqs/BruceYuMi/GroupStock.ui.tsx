import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { GroupStock } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	id2: {
		"name": "id2",
		"type": "id",
		"isKey": false,
		"label": "Id2"
	} as FieldItemId,
	order: {
		"name": "order",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Order"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.order, 
];

export const ui: UI = {
	label: "GroupStock",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: GroupStock):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
