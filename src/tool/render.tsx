/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { FA, LMR } from 'tonva-react';
import { NStockInfo } from '../stockinfo';
import {percent0, percent1, number, numberToMarketValue, calculateZZ3} from '../tool';

function renderSortCol(radioName:string, sortMethod:string, caption:string, sort: (sortMethod:string) => void, checked:boolean = false) {
	return <label className="btn btn-outline-info mb-0">
		<input type="radio" className="btn-sm btn-check mr-1"
			name={radioName} defaultChecked={checked}
			onClick={() => sort(sortMethod)} />
		{caption}
	</label>
}

export function renderSortHeaders(radioName:string, sort: (sortMethod:string) => void) {
	return <div className="my-1 justify-content-end mr-2">
		<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
			{renderSortCol(radioName, 'tagv', '米息率', sort, true)}
			{renderSortCol(radioName, 'tagpe', 'TTM', sort)}
			{renderSortCol(radioName, 'tagdp', '股息率', sort)}
		</div>
	</div>;
}

function renderValue(caption:string, value:number, valueType:'p0'|'p1'|'n1'|'n2'|'yi'):JSX.Element {
	const _cn = 'px-2 mb-2 text-right '; 
	let cn = _cn + 'c5';
	let cnYI = _cn + 'c5'
	let vStr:string;
	switch (valueType) {
		case 'p0': vStr = percent0(value); break;
		case 'p1': vStr = percent1(value); break;
		case 'n1': vStr = number(value, 1); break;
		case 'n2': vStr = number(value, 2); break;
		case 'yi': 
			vStr = numberToMarketValue(value);
			cn = cnYI;
			break;
	}
	return <div key={caption} className={cn}>
		<span className="text-muted small">{caption}</span><br />
		{vStr}
	</div>;
}

export function renderStockInfoRow(row: NStockInfo, onClickName: (row:NStockInfo) => void, inputSelect:JSX.Element, right:JSX.Element):JSX.Element {
  	let { id, name, code, pe, roe, price, divyield, v, order, symbol, l, e, ep, e3, total } = row;
  	let zzl = calculateZZ3((row as any).dataArr);
  	let left = <div className="cursor-pointer" onClick={()=>onClickName(row)}>
		<span className="text-primary">{name}</span>
		&nbsp; 
		<span className="text-info">{code}</span>
	  	&nbsp;
		<small className="small ml-1"><span className="text-danger">{order}</span></small>
  	</div>;
	let rows:[string,number,'p0'|'p1'|'n1'|'n2'|'yi'][] = [
		['米息率', v, 'n1'],
		['TTM', pe, 'n1'],
		['股息率', divyield*100, 'n1'],
		['价格', price, 'n2'],
		['ROE', roe*100, 'n1'],
		['预增', l, 'p0'],
		['现增', zzl[3], 'p0'],
		['增 1', zzl[2], 'p0'],
		['增 2', zzl[1], 'p0'],
		['增 3', zzl[0], 'p0'],
		['市值', total*price, 'yi'],
  	];
	let inputSelectSpan:any;
	if (inputSelect) {
		inputSelectSpan = <span className="ml-4">{inputSelect}</span>
	}
  	return <div className="d-block border-top">
		<LMR className="px-2 py-1 bg-light" left={left} right = {right}>{inputSelectSpan}</LMR>
		<div className="d-flex flex-wrap" >
			{rows.map(v => renderValue(v[0], v[1], v[2]))}
	  	</div>
  	</div>;
}

export function renderStockUrl(row: NStockInfo) {
    let { symbol } = row;
	return <a className="text-info" href={`https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>
		<FA name="angle-double-right" />
	</a>;
}
