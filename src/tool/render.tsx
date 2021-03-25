/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { FA, LMR } from 'tonva-react';
import { Market, Stock, StockValue } from 'uq-app/uqs/BruceYuMi';
import { NStockInfo } from '../stockinfo';
import {percent0, percent1, number, numberToMarketValue, calculateZZ3} from '../tool';

function renderSortCol(radioName:string, sortMethod:string, caption:string, 
	sort: (sortMethod:string) => void, defaultSort:string) {
	return <label className="btn btn-outline-info mb-0">
		<input type="radio" className="btn-sm btn-check mr-1"
			name={radioName} defaultChecked={sortMethod === defaultSort}
			onClick={() => sort(sortMethod)} />
		{caption}
	</label>
}

export function renderSortHeaders(radioName:string, defaultSort:string, sort: (sortMethod:string) => void) {
	if (!defaultSort) defaultSort = 'tagv';
	return <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
		{renderSortCol(radioName, 'tagv', '米息分', sort, defaultSort)}
		{renderSortCol(radioName, 'tagpe', 'TTM', sort, defaultSort)}
		{renderSortCol(radioName, 'tagdp', '股息率', sort, defaultSort)}
	</div>;
}

function renderValue(caption:string, value:number, valueType:'p0'|'p1'|'n1'|'n2'|'yi'):JSX.Element {
	const _cn = 'px-2 mb-1 text-right '; 
	let cn = _cn + 'c5';
	let cnYI = _cn + 'c5'
	let vStr:string;
	if (isNaN(value) === true) {
		vStr = '-'
	}
	else {
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
	}
	return <div key={caption} className={cn}>
		<span className="text-muted small">{caption}</span><br />
		{vStr}
	</div>;
}

export function renderStockInfoRow(row: NStockInfo, onClickName: (row:NStockInfo) => void, inputSelect:JSX.Element, right:JSX.Element):JSX.Element {
  	let { id, name, code, pe, roe, price, divyield, v, order, symbol, l, pshares } = row;
  	let zzl = calculateZZ3((row as any).dataArr);
  	let left = <div className="cursor-pointer" onClick={()=>onClickName?.(row)}>
		<span className="text-primary">{name}</span>
		&nbsp; 
		<span className="text-info">{symbol}</span>
	  	&nbsp;
		<small className="small ml-1"><span className="text-danger">{order}</span></small>
  	</div>;
	let rows:[string,number,'p0'|'p1'|'n1'|'n2'|'yi'][] = [
		['米息分', Math.log2(v), 'n1'],
		['米息率', v, 'n1'],
		['股息率', divyield, 'n1'],
		['TTM', pe, 'n1'],
		['价格', price, 'n2'],
		['ROE', roe, 'n1'],
		['均增', l, 'p0'],
		['现增', zzl[3], 'p0'],
		['增 1', zzl[2], 'p0'],
		['增 2', zzl[1], 'p0'],
		['增 3', zzl[0], 'p0'],
		['市值', pshares*price, 'yi'],
  	];
	let inputSelectSpan:any;
	if (inputSelect) {
		inputSelectSpan = <span className="ml-4">{inputSelect}</span>
	}
  	return <div className="d-block border-top">
		<LMR className="px-2 py-1 bg-light" left={left} right = {right}>{inputSelectSpan}</LMR>
		<div className="d-flex flex-wrap p-1" >
			{rows.map(v => renderValue(v[0], v[1], v[2]))}
	  	</div>
  	</div>;
}

export function renderStockName(stock: Stock):JSX.Element {
	let { name, code } = stock;
	let $market = (stock as any).$market;
	return <>
		{$market && <>{$market.el}&nbsp;</>}
		<span className="text-primary">{name}</span>
		&nbsp; 
		<span className="text-info">{code}</span>
		&nbsp;
	</>;
}

export function renderStockRow(order: number, stock: Stock&StockValue, onClickName: (stock:Stock&StockValue) => void, inputSelect:JSX.Element, right:JSX.Element):JSX.Element {
	let { roe, price, divident, miRate, volumn, ttm, inc1, inc2, inc3, inc4, preInc } = stock;
	let left = <div className="cursor-pointer align-self-center flex-grow-1" onClick={()=>onClickName(stock)}>
		{order && <><small className="mr-2 text-danger">{order}</small>&nbsp;</>}
		{renderStockName(stock)}
	</div>;
	let rows:[string,number,'p0'|'p1'|'n1'|'n2'|'yi'][] = [
		['米息分', Math.log2(miRate), 'n1'],
		['米息率', miRate, 'n1'],
		['TTM', ttm, 'n1'],
		['股息率', divident, 'n1'],
		['价格', price, 'n2'],
		['ROE', roe, 'n1'],
		['均增', preInc/100, 'p0'],
		['现增', inc4/100, 'p0'],
		['增 1', inc3/100, 'p0'],
		['增 2', inc2/100, 'p0'],
		['增 3', inc1/100, 'p0'],
		['市值', volumn * price, 'yi'],
	];
	return <div className="d-block border-top">
		<div className="d-flex px-2 py-1 bg-light">
			{left}
			{right}
		</div>
		<div className="d-flex flex-wrap p-1" onClick={()=>onClickName?.(stock)}>
			{rows.map(v => renderValue(v[0], v[1], v[2]))}
		</div>
	</div>;
}

const nFormat = new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 3 });
export function formatNumber(num: number): string {
	return nFormat.format(num);
}
export const nFormat0 = {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
};
export const nFormat1 = { 
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
};

export function renderStockUrl(row: NStockInfo) {
    let { symbol, market, code } = row;
    let url = market === 'HK' ? `https://xueqiu.com/S/${code}` : `https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
	return <a className="text-info" href={url} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>
		<FA name="angle-double-right" />
	</a>;
}