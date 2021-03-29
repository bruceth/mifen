import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Account } from "./BruceYuMi";

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
	name: {
		"name": "name",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "Name"
	} as FieldItemString,
	portion: {
		"name": "portion",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Portion"
	} as FieldItemInt,
};
/*==fields==*/

export const fieldArr: FieldItem[] = [
	fields.no, fields.name, fields.portion, 
];

export const ui: UI = {
	label: "Account",
	fieldArr,
	fields,
};

export const resRaw: Res<any> = {
	$zh: {
		No: '编号',
		Name: '名称',
		Portion: '份数',
	},
	$en: {
	}
};

const res: any = {};
setRes(res, resRaw);

export const t:TFunc = (str:string|JSX.Element): string|JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: Account):JSX.Element {
	let {name} = item;
	return <>{t(name)}</>;
};
