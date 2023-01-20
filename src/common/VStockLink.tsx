import { View } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CCommon } from "./CCommon";

export class VStockLink extends View<CCommon> {
	render(stock: Stock & StockValue):JSX.Element {
		let {no} = stock;
		let $market = (stock as any).$market;
		let mn = $market.name;
		let symbol = mn + no;
		let url:string, title:string;
		switch (mn) {
            case 'us':
				url = `https://xueqiu.com/S/${no}`;
				title = '雪球';
				break;
			case 'hk':
				url = `https://xueqiu.com/S/${no}`;
				title = '雪球';
				break;
			default:
				url = `https://finance.sina.com.cn/realstock/company/${symbol}/nc.shtml`;
				title = '新浪财经';
                let url1 = `https://xueqiu.com/S/${symbol}`;
                let title1 = '雪球';
				return <><a className="btn btn-sm btn-link d-sm-inline d-none" href={url} target="_blank" rel="noreferrer">{title}</a>
                    <a className="btn btn-sm btn-link d-sm-inline d-none" href={url1} target="_blank" rel="noreferrer">{title1}</a>
                </>
		}
		return <a className="btn btn-sm btn-link d-sm-inline d-none" href={url} target="_blank" rel="noreferrer">
			{title}
		</a>;
	}
}
