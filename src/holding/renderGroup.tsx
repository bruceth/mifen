import { EnumGroupType, Group } from "uq-app/uqs/BruceYuMi";

export function renderGroup(item: Group, index:number, IDRender: (item: Group, index:number)=>JSX.Element) {
	let {type} = item;
	let cn:string;
	switch (type) {
		case EnumGroupType.all: cn = 'text-primary'; break;
		case EnumGroupType.black: cn = 'text-muted'; break;
	}
	return <span className={cn}>{IDRender(item, index)}</span>;
}
