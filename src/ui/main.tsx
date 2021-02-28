import * as React from 'react';
import { VPage, TabCaptionComponent, Page, TabProp } from 'tonva';
import { CMiApp } from '../UqApp';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VHome extends VPage<CMiApp> {
	async open(param?: any) {
		this.openPage(this.render);
	}
	render = (param?: any): JSX.Element => {
		let { cHome, cExporer, cMe } = this.controller;
		let tabs: TabProp[] = [
			{ 
				name: 'home', label: '首页', icon: 'home', content: cHome.tab, 
				notify: undefined, 
				//load: cHome.load, 
				onShown: cHome.load,
			},
			{
				name: 'explorer', label: '选股', icon: 'search', content: cExporer.tab, load: cExporer.load 
			},
			{
				name: 'me', label: '我的', icon: 'user', content: cMe.tab, onShown: undefined
			}
		].map(v => {
			let { name, label, icon, content, notify, load, onShown } = v;
			return {
				name,
				caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
				content,
				notify,
				load,
				onShown,
			};
		});
		return <Page header={false} tabsProps={{tabs}} />
	}
}
