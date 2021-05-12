import { FA, List, Scroller, VPage } from "tonva-react";
import { CXIList } from "./CXIList";

export class VXIList extends VPage<CXIList<any, any>> {
	header() {
		let {props} = this.controller;
		let {listHeader, header} = props;
		if (listHeader) return listHeader;
		if (header) {
			switch (typeof header) {
				default: return header;
				case 'string': return header + ' ' + this.t('list');				
			}
		}
		let {ID} = this.controller.props;
		let ret = ID.t(ID.sName);
		if (typeof ret === 'string') return ret + ' ' + this.t('list');
		return  <>{ret} {this.t('list')}</>;
	}
	right():JSX.Element {
		let {props, onSetIXItem} = this.controller;
		let {renderRight} = props;
		if (renderRight === null) return null;
		if (renderRight !== undefined) return renderRight();
		return <button className="btn btn-sm btn-success mr-1" 
			onClick={onSetIXItem}>
			<FA name="chain" />
		</button>;
	}
	content() {
		let {props, onClickItem} = this.controller;
		let {renderItem, renderXi, xi} = props;
		let vIx: any;
		if (renderXi) {
			vIx = renderXi(xi);
		}
		else {
			vIx = <div className="p-3">{JSON.stringify(xi)}</div>;
		}
		return <div>
			{vIx}
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
