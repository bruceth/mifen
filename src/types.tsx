export interface UserTag {
  tagName: string;
  tagID?: number;
}

export interface StockFindConfig {
  sortType: string;
  selectType?: string;
}

export interface UserStockConfig {
  sortType: string;
}

export interface RegressionConfig {
  bmin: number;
  bmax: number;
  r2: number;
  lmin: number;
  lmax: number;
  lr2: number;
  mcount: number;
  lr4: number;
}

export interface MiConfigs {
  tagName: string;
  stockFind: StockFindConfig;
  userStock: UserStockConfig;
  regression: RegressionConfig;
  accountName?: string;
}

export interface IdName {
  id: number;
  name: string;
}
