import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";

export interface MiStock extends Stock, StockValue {
	id: number;
	miRate: number;
}
