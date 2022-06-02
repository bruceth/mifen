import { Stock } from "uq-app/uqs/BruceYuMi";

export interface BaseStockInfo {
    id: number,
    rawId: number,
    name: string,
    code: string,
    market: string,
    symbol: string,
    alias?: string,
};

export interface NStockInfo extends BaseStockInfo {
    stock?: Stock,
    day?: number,
    trackDay?: number,
};

export interface StockPrice {
    day: number,
    price: number,
};

export interface StockEarning {
    year: number,
    earning: number,
    yearlen: number,
}

export interface StockRoe {
    year: number,
    roe: number,
    e: number,
}

export interface StockCapitalearning {
    year: number,
    capital: number,
    earning: number,
}

export interface StockBonus {
    day: number,
    bonus: number,
    shares: number,
}

export interface StockDivideInfo {
    day: number,
    送股: number,
    转增: number,
    派息: number,
    配股: number,
    配股价: number
}
