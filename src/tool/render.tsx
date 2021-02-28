/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { FA, LMR } from 'tonva';
import { NStockInfo } from '../stockinfo';
import {percent0, percent1, number, numberToMarketValue, calculateZZ3} from '../tool';

function renderSortCol(type:string, caption:string, sort: (sortType:string) => void, checked:boolean = false) {
	return <label className="btn btn-outline-info mb-0">
		<input type="radio" className="btn-sm btn-check mr-1"
			name="btnradio" defaultChecked={checked}
			onClick={() => sort(type)} />
		{caption}
	</label>
}

export function renderSortHeaders(sort: (sortType:string) => void) {
	return <div className="my-1 justify-content-end mr-3">
		<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
			{renderSortCol('tagv', '米息率', sort, true)}
			{renderSortCol('tagpe', 'TTM', sort)}
			{renderSortCol('tagdp', '股息率', sort)}
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

export function renderStockInfoRow(row: NStockInfo, onClickName: (row:NStockInfo) => void, right:JSX.Element):JSX.Element {
  	let { id, name, code, pe, roe, price, divyield, v, order, symbol, l, e, ep, e3, total } = row;
  	let zzl = calculateZZ3((row as any).dataArr);
  	let left = <div className="ml-3 cursor-pointer" onClick={()=>onClickName(row)}>
		<span className="text-primary">{name}</span>
		&nbsp; 
		<span className="text-info">{code}</span>
	  	&nbsp;
		<span className="small ml-5">{order}</span>
  	</div>;
	let rows:[string,number,'p0'|'p1'|'n1'|'n2'|'yi'][] = [
		['米息率', v, 'n1'],
		['TTM', pe, 'n1'],
		['股息率', divyield*100, 'n1'],
		['价格', price, 'n2'],
		['ROE', roe*100, 'n1'],
		['增1', zzl[0], 'p0'],
		['增2', zzl[1], 'p0'],
		['增3', zzl[2], 'p0'],
		['增4', zzl[3], 'p0'],
		['预增', l, 'p0'],
		['市值', total*price, 'yi'],
  	];
  	return <div className="d-block">
		<LMR className="px-1 py-1" left={left} right = {right} />
		<div className="d-flex flex-wrap" >
			{rows.map(v => renderValue(v[0], v[1], v[2]))}
	  	</div>
  	</div>;
}
