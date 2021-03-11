import { UqExt as Uq } from './BruceYuMi';
import * as Account from './Account.ui';
import * as Holding from './Holding.ui';
import * as Transaction from './Transaction.ui';
import * as Stock from './Stock.ui';
import * as Market from './Market.ui';
import * as Portfolio from './Portfolio.ui';
import * as StockValue from './StockValue.ui';
import * as AccountValue from './AccountValue.ui';
import * as UserAccount from './UserAccount.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.Account, Account);
	Object.assign(uq.Holding, Holding);
	Object.assign(uq.Transaction, Transaction);
	Object.assign(uq.Stock, Stock);
	Object.assign(uq.Market, Market);
	Object.assign(uq.Portfolio, Portfolio);
	Object.assign(uq.StockValue, StockValue);
	Object.assign(uq.AccountValue, AccountValue);
	Object.assign(uq.UserAccount, UserAccount);
}
export * from './BruceYuMi';
