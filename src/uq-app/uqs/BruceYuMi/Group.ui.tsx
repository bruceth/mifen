import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Group } from "./BruceYuMi";

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
	type: {
		"name": "type",
		"isKey": false,
		"label": "Type"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.no, fields.name, fields.type, 
];

const resRaw: Res<any> = {
	$zh: {
		Group: '股票组',
		myAll: '我的自选',
		Name: '组名',
		myBlack: '不关注',
	},
	$en: {
		myAll: 'My Selection',
		myBlack: 'Block List',
	}
};

const res: any = {};
setRes(res, resRaw);

export const t:TFunc = (str:string|JSX.Element): string|JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: Group):JSX.Element {
	let {name} = item;
	return <>{t(name)}</>;
};

export const ui: UI = {
	label: t("Group"),
	fieldArr,
	fields,
};
