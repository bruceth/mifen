import React from "react";
import { observer } from "mobx-react";
import { FA, List, View } from "tonva-react";
import { CGroup } from "./CGroup";
import { MGroup } from "store/mGroup";

const pos = {right:"-1.0rem", bottom:"-0.3rem"};

export class VGroups extends View<CGroup> {
	render(groups: MGroup[]):JSX.Element {
		return React.createElement(observer(() => {
			return <List items={groups} 
				item={{render: this.renderGroup, onClick:this.controller.showMiGroup}} 
				className="d-flex flex-wrap bg-white p-1" />;
		}));
	}

	private renderGroup = (group:MGroup, index: number):JSX.Element => {
		let {name, count, type} = group;
		let left:any;
		switch (type) {
			default:
			case 'group':
				left = <FA name="list-alt" className="text-info align-self-center" />;
				break;
			case 'industry':
				left = <FA name="industry" className="text-primary align-self-center" />;
				break;
		}
		let right = count > 0 && <small className="text-muted position-absolute" style={pos}>{count}</small>;
		return <div className="d-block w-min-6c text-center py-1 m-1 border rounded bg-white">
			<span className="position-relative">
				{left} {right}
			</span>
			<div className="">{name}</div>
		</div>;
	}
}
