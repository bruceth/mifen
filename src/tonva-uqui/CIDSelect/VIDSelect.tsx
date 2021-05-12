import { List, Scroller, VPage } from "tonva-react";
import { CIDSelect } from "./CIDSelect";

export class VIDSelect extends VPage<CIDSelect<any>> {
	header() {
		let selText = this.t('select');
		let {props} = this.controller;
		let {listHeader, header} = props;
		if (listHeader) return listHeader;
		if (header) {
			switch (typeof header) {
				default: return header;
				case 'string': return selText + ' ' + header + ' ';
			}
		}
		let {ID} = this.controller.props;
		let ret = ID.t(ID.sName);
		if (typeof ret === 'string') return selText + ' ' + ret;
		return  <>{selText} {ret}</>;
	}
	right():JSX.Element {
		return null;
		/*
		let {props, onAddItem} = this.controller;
		let {renderRight} = props;
		if (renderRight === null) return null;
		if (renderRight !== undefined) return renderRight();
		return <button className="btn btn-sm btn-success mr-1" 
			onClick={onAddItem}>
			<FA name="plus" />
		</button>;
		*/
	}
	content() {
		let {props, onClickItem} = this.controller;
		let {renderItem} = props;
		return <div>
			<List items={this.controller.pageItems} 
				item={{
					render: renderItem ?? this.renderItem,
					onClick: onClickItem,
				}} />
		</div>
	}	

	private renderItem = (item:any, index:number) => {
		return <div className="px-3 py-2">
			{this.controller.props.ID.render(item)}
		</div>;
	}

	protected onPageScroll(e:any) {}
	protected async onPageScrollTop(scroller: Scroller): Promise<boolean> {return false;}
	protected async onPageScrollBottom(scroller: Scroller): Promise<void> {
		await this.controller.pageItems.more();
		return;
	}
	protected afterBack():void {}
}
