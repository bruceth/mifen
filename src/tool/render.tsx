/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { FA } from 'tonva-react';
import { Stock, StockValue } from 'uq-app/uqs/BruceYuMi';
import { NStockInfo } from '../stockinfo';

function renderValue(caption:string, value:number, valueType:'p0'|'p1'|'n1'|'n2'|'yi'):JSX.Element {
	const _cn = 'px-2 px-sm-3 mb-1 text-right '; 
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

export function renderStockName(stock: Stock):JSX.Element {
	let { name, no } = stock;
	let $market = (stock as any).$market;
	return <>
		{$market && <>{$market.el}&nbsp;</>}
		<span className="text-primary">{name}</span>
		&nbsp; 
		<span className="text-info">{no}</span>
		&nbsp;
	</>;
}

export const smallPercent = <small>%</small>;

export function renderStockRow(order: number, stock: Stock&StockValue, onClickName: (stock:Stock&StockValue) => void, right:JSX.Element):JSX.Element {
	let { roe, price, dvRate, miRate, volumn, ttm, inc1, inc2, inc3, inc4, preInc, smoothness } = stock;
	let stars = [0,0,0,0];
	for (let i=2; i<=smoothness; i++) stars[i-2] = 1;
	let left = <div className="cursor-pointer align-self-center flex-grow-1" onClick={()=>onClickName?.(stock)}>
		{order && <><small className="mr-2 text-danger">{order}</small>&nbsp;</>}
		{renderStockName(stock)}
		<div className="bg-light px-3 small d-block d-sm-inline-block">
			{
				stars.map((v, index) => v===1?
					<FA key={index} 
						name='star-o' 
						className={'small px-1 ' + (v===1? 'text-warning':'text-muted')} />
					:
					null )
			}
		</div>
	</div>;
	let rows:[string,number,'p0'|'p1'|'n1'|'n2'|'yi'][] = [
		// ['米息分', Math.log2(miRate), 'n1'],
		// ['米息率', miRate, 'n1'],
		['TTM', ttm, 'n1'],
		['股息率', dvRate/100, 'p1'],
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
			<div className="px-2 px-sm-3 mb-1 text-right c5">
				<span className="small">米息率</span><br />
				{number(miRate, 1)}
			</div>
			{rows.map(v => renderValue(v[0], v[1], v[2]))}
		</div>
	</div>;
}

//const nFormat = { maximumSignificantDigits: 3 };
export function formatNumber(num: number): string {
	return num.toLocaleString(undefined, nFormat0); // nFormat.format(num);
}

export interface NFormat {
	minimumFractionDigits: number;
	maximumFractionDigits: number;
}

export const nFormat0:NFormat = {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
};
export const nFormat1:NFormat = {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
};
export const nFormat2:NFormat = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
};

export function renderStockUrl(row: NStockInfo) {
    let { symbol, market, code } = row;
    let url = market === 'HK' ? `https://xueqiu.com/S/${code}` : `https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
	return <a className="text-info" href={url} target="_blank" rel="noopener noreferrer" onClick={(e)=>{e.stopPropagation();}}>
		<FA name="angle-double-right" />
	</a>;
}

function number(n: number, w = 2) {
    return n === undefined ? '' : n.toFixed(w);
}

function numberToMarketValue(n: number) {
    return n === undefined || isNaN(n) ? '' : Math.round(n / 10000).toString(); // + '亿';
}

function percent0(n: number) {
    return n === undefined || isNaN(n) ? '' : (n * 100).toFixed(0) + '%';
}

function percent1(n: number) {
    return n === undefined || isNaN(n) ? '' : (n * 100).toFixed(1) + '%';
}
