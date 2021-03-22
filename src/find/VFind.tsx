import { SearchBox, VPage } from "tonva-react";
import { CFind } from "./CFind";

export class VFind extends VPage<CFind> {
	header() {return '发现'}
	content() {
		let {showA, showHK, showSH, showSZ, showAll} = this.controller;
		let renderButton = (caption:string, onClick:()=>void) => <button className="btn btn-outline-info mr-3 mb-3" onClick={onClick}>{caption}</button>;
		return <div className="p-3">
			<SearchBox className="mb-3" onSearch={this.controller.onSearch} placeholder="股票代码，名称" />
			<div className="d-flex flex-wrap">
				{renderButton('A股', showA)}
				{renderButton('港股', showHK)}
				{renderButton('沪A', showSH)}
				{renderButton('深A', showSZ)}
				{renderButton('全部', showAll)}
			</div>
		</div>
	}
}
