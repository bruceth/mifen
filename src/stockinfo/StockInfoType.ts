export interface BaseStockInfo { 
  id:number,
  name:string,
  code:string,
  symbol:string,
  alias?:string,
};

export interface NStockInfo extends BaseStockInfo { 
  pe?:number,
  roe?:number,
  price?:number,
  order?:number,
  divyield?:number,
  ma?:number,
  m1?:number,
  m2?:number,
  m3?:number,
  m4?:number,
  m5?:number,
  b?:number,
  r2?:number,
  ep1?:number,
  l?:number,
  lr2?:number,
  b10?:number,
  r210?:number,
  l10?:number,
  lr210?:number,
  ep2?:number,
  lr4?:number,
  predictpp?:number,
  e?:number,
  capital?:number,
  bonus?:number,
  day?:number,
  exprice?:number,
  nprice?:number,
  nprice2?:number,
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
}

export interface StockDivideInfo {
  日期: number,
  送股: number,
  转增: number,
  派息: number,
  配股: number,
  配股价: number
}
