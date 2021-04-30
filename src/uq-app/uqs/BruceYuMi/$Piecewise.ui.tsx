import { Res, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { $Piecewise } from "./BruceYuMi";

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
		"isKey": true,
		"label": "Name"
	} as undefined,
	ratio: {
		"name": "ratio",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Ratio"
	} as FieldItemNum,
	offset: {
		"name": "offset",
		"type": "number",
		"isKey": false,
		"widget": "updown",
		"label": "Offset"
	} as FieldItemNum,
	asc: {
		"name": "asc",
		"isKey": false,
		"label": "Asc"
	} as undefined,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.name, fields.offset, fields.asc, 
];

export const ui: UI = {
	label: "$Piecewise",
	fieldArr,
	fields,
};

export const res: Res<any> = {
	zh: {
	},
	en: {
	}
};

export function render(item: $Piecewise):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
