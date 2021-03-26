//=== UqApp builder created on Tue Jan 05 2021 18:41:24 GMT-0500 (GMT-05:00) ===//
import { VPage, TabProp, TabCaptionComponent, TabsProps } from 'tonva-react';
import { CApp } from './CApp';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';
/*
function caption(label:string|JSX.Element, icon:string) {
	return (selected: boolean) => TabCaptionComponent(label, icon, color(selected));
}
*/
export class VMain extends VPage<CApp> {
	header() {return false;}

	protected get tabsProps(): TabsProps {
		/*
		let { cHome, cBug, cMe, cUI } = this.controller;
		let tabs: TabProp[] = [
			{name: 'home', caption: caption(t('home'), 'home'), content: cHome.tab},
			{name: 'me', caption: caption(t('me'), 'user-o'), content: cMe.tab, load: cMe.load},
		];
		if (this.isDev === true) {
			tabs.push({
				name: 'UI', caption: caption(t('UI'), 'television'), content: cUI.tab
			});
			tabs.push({
				name: 'debug', caption: caption(t('debug'), 'bug'), content: cBug.tab, onShown: cBug.load
			});
		}
		return {tabs};
		*/
		let { cHome, cFind, cMe } = this.controller;
		let tabs: TabProp[] = [
			/*{ 
				name: 'home', label: '首页', icon: 'home', content: cHome.tab, 
				notify: undefined, 
				load: cHome.load, 
				onShown: cHome.load,
			},*/
			{
				name: 'home', label: '首页', icon: 'money', 
				notify: undefined,
				content: cHome.tab, //load: cGroup.load, onShow: cGroup.load,
			},
			/*{
				name: 'explorer', label: '持仓', icon: 'money', content: cHolding.tab, // load: cHolding.load 
			},*/
			{
				name: 'find', label: '发现', icon: 'search', content: cFind.tab, load: cFind.load
			},
			/*
			{
				name: 'explorer', label: '选股', icon: 'search', content: cExporer.tab, load: cExporer.load
			},*/
			{
				name: 'me', label: '我的', icon: 'user', content: cMe.tab, onShown: undefined, load: cMe.load
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
		return {tabs};
	}

	/*
	protected get webNav(): PageWebNav {
		return {
			navHeader: <div>webNav header</div>, 
			navFooter: <div>webNav footer</div>,
		};
	}
	*/
}
