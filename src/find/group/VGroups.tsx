import React from "react";
import { observer } from "mobx-react";
import { FA, List, View } from "tonva-react";
import { CGroup } from "./CGroup";
import { MiGroup } from "store/miGroup";

const pos = {right:"-0.8rem", bottom:"-0.3rem"};

export class VGroups extends View<CGroup> {
	render():JSX.Element {
		return React.createElement(observer(() => {
			let {cApp} = this.controller;
			let {miGroups} = cApp.store;
			let {groups } = miGroups;
			//let listHeader = (caption:string) => <div className="small text-muted pt-2 pb-1 px-3">{caption}</div>;
			//{listHeader('分组')}
			return <List items={groups} 
				item={{render: this.renderGroup, onClick:this.controller.showMiGroup}} 
				className="mb-3 d-flex flex-wrap p-1 bg-light" />;
		}));
	}

	private renderGroup = (group:MiGroup, index: number):JSX.Element => {
		let {name, count} = group;
		let right = count > 0 && <small className="text-muted position-absolute" style={pos}>{count}</small>;
		let left = <FA name="list-alt" className="text-info align-self-center" size="lg" fixWidth={true} />;
		return <div className="d-block w-min-6c text-center py-1 m-1 border rounded bg-white">
			<span className="position-relative">
				{left} {right}
			</span>
			<div className="">{name}</div>
		</div>;
	}
}
