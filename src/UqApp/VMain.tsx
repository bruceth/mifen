//=== UqApp builder created on Mon Mar 01 2021 15:27:12 GMT-0500 (GMT-05:00) ===//
import { VPage, TabCaptionComponent, Page, TabProp } from 'tonva-react';
import { CApp } from './CApp';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VMain extends VPage<CApp> {
	async open(param?: any) {
		this.openPage(this.render);
	}
	render = (param?: any): JSX.Element => {
		let { cHome, cHolding, cExporer, cMe } = this.controller;
		let tabs: TabProp[] = [
			{ 
				name: 'home', label: '首页', icon: 'home', content: cHome.tab, 
				notify: undefined, 
				//load: cHome.load, 
				onShown: cHome.load,
			},
			{
				name: 'explorer', label: '持仓', icon: 'money', content: cHolding.tab, load: cHolding.load 
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
