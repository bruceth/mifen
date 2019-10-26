export interface UserTag {
  tagName: string;
  tagID?: number;
}

export interface StockFindConfig {
  sortType: string;
}

export interface UserStockConfig {
  sortType: string;
}

export interface MiConfigs {
  tagName: string;
  stockFind: StockFindConfig;
  userStock: UserStockConfig;
}
