import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { $PiecewiseDetail } from "./BruceYuMi";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	parent: {
		"name": "parent",
		"type": "id",
		"isKey": true,
		"label": "Parent"
	} as FieldItemId,
	row: {
		"name": "row",
		"type": "integer",
		"isKey": true,
		"widget": "updown",
		"label": "Row"
	} as FieldItemInt,
	sec: {
		"name": "sec",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Sec"
	} as FieldItemNum,
	value: {
		"name": "value",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Value"
	} as FieldItemNum,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.parent, fields.row, fields.sec, fields.value, 
];

export const ui: UI = {
	label: "$PiecewiseDetail",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: $PiecewiseDetail):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
