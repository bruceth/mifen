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

export interface MiConfigs {
  tagName: string;
  stockFind: StockFindConfig;
  userStock: UserStockConfig;
  accountName?: string;
}

export interface IdName {
  id: number;
  name: string;
}
