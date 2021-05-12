import { observer } from "mobx-react";
import { FA, PropGrid, VPage } from "tonva-react";
import { CIDView } from "./CIDView";

export class VIDView extends VPage<CIDView<any>> {
	header() {
		let {ID} = this.controller.props;
		return ID.t(ID.sName);
	}
	right() {
		let {props, onEditItem: onAddItem} = this.controller;
		let {renderRight} = props;
		if (renderRight === null) return null;
		if (renderRight !== undefined) return renderRight();
		return <button className="btn btn-sm btn-info mr-1" 
			onClick={onAddItem}>
			<FA name="pencil" />
		</button>;
	}
	content() {
		let V = observer(() => {
			let {item, gridProps} = this.controller;
			return <div className="py-3">
				<PropGrid rows={gridProps}
					values={item} />
			</div>;	
		});
		return <V />;
	}
}
