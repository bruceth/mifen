import { Group } from "uq-app/uqs/BruceYuMi";

export function renderGroup(item: Group, index:number, IDRender: (item: Group, index:number)=>JSX.Element) {
	let cn:string = '';
	return <span className={cn}>{IDRender(item, index)}</span>;
}
