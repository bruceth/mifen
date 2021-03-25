import React from "react";
import { observer } from "mobx-react";
import { FA, List, LMR, View } from "tonva-react";
import { CGroup } from "./CGroup";
import { MiGroup } from "store/miGroup";

export class VGroups extends View<CGroup> {
	render():JSX.Element {
		return React.createElement(observer(() => {
			let {cApp} = this.controller;
			let {miGroups} = cApp.store;
			let {groups } = miGroups;
			let listHeader = (caption:string) => <div className="small text-muted pt-2 pb-1 px-3">{caption}</div>;
			return <>
				{listHeader('分组')}
				<List items={groups} item={{render: this.renderGroup, onClick:this.controller.showMiGroup}} className="mb-3" />
			</>;
		}));
	}

	private renderGroup = (group:MiGroup, index: number):JSX.Element => {
		let {name, count} = group;
		let left = <FA name="list-alt" className="text-info align-self-center ml-3" size="lg" fixWidth={true} />;
		let right = count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>;
		return <LMR left={left} right={right}>
			<div className="px-3 py-2">{name}</div>
		</LMR>;
	}
}
