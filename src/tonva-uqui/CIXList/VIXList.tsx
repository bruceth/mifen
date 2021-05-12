import { FA, List, Scroller, VPage } from "tonva-react";
import { CIXList } from "./CIXList";

export class VIXIDList extends VPage<CIXList<any, any>> {
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
		let {props, onAddItem} = this.controller;
		let {renderRight} = props;
		if (renderRight === null) return null;
		if (renderRight !== undefined) return renderRight();
		return <button className="btn btn-sm btn-success mr-1" 
			onClick={onAddItem}>
			<FA name="plus" />
		</button>;
	}
	content() {
		let {props, onClickItem} = this.controller;
		let {renderItem, renderIx, ix} = props;
		let vIx: any;
		if (renderIx) {
			vIx = renderIx(ix);
		}
		else {
			vIx = <div className="p-3">{JSON.stringify(ix)}</div>;
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
