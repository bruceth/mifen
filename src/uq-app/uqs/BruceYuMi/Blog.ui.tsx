import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Blog } from "./BruceYuMi";

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
	caption: {
		"name": "caption",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "Caption"
	} as FieldItemString,
	content: {
		"name": "content",
		"isKey": false,
		"label": "Content"
	} as undefined,
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
	$update: {
		"name": "$update",
		"isKey": false,
		"label": "$update"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.no, fields.caption, fields.content, fields.$owner, fields.$create, fields.$update, 
];

export const ui: UI = {
	label: "Blog",
	fieldArr,
	fields,
};

const resRaw: Res<any> = {
	zh: {
	},
	en: {
	}
};
const res: any = {};
setRes(res, resRaw);

export const t:TFunc = (str:string|JSX.Element): string|JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: Blog):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
