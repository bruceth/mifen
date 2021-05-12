import { Prop } from "tonva-react";
import { IDBase } from "../base";
import { CIDBase } from "../CIDBase";
import { CIDEdit } from "../CIDEdit";
import { IDViewUiProps } from "../props";
import { VIDView } from "./VIDView";

export class CIDView<T extends IDBase> extends CIDBase<T, IDViewUiProps<T>> {
	protected async internalStart(item: T) {
		this.item = item;
		await this.props.ID.loadSchema();
		this.buildGridProps();
		this.openVPage(VIDView);
	}

	private _props: Prop[];
	get gridProps():Prop[] {
		if (this._props !== undefined) return this._props;
		return this._props = this.buildGridProps();
	}

	protected buildGridProps():Prop[] {
		let ret:Prop[] = [];
		let {ui, t, schema} = this.props.ID;
		//let {exFields} = schema;
		let {fieldArr } = ui;
		for (let f of fieldArr) {
			//let exField = (exFields as any[]).find(v => v.field === f.name);
			//if (!exField) continue;
			let prop = {
				...f,
				label: t(f.label),
			};
			ret.push(prop as any);
		}
		return ret;
	}

	onEditItem = async () => {
		let {onEditItem, onItemChanged} = this.props;
		if (onEditItem === null) return;
		if (onEditItem !== undefined) {
			this.item = await onEditItem(this.item);
			onItemChanged?.(this.item);
		}
		else {
			let cIDEdit = new CIDEdit({
				...this.props, 
				renderRight: undefined, 
				onItemChanged: async (item: T) => {
					onItemChanged?.(item);
				}
			});
			await cIDEdit.start(this.item);
		}
	}
}
