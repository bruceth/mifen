import { UqExt as Uq } from './BruceYuMi';
import * as $Piecewise from './$Piecewise.ui';
import * as Market from './Market.ui';
import * as Transaction from './Transaction.ui';
import * as Group from './Group.ui';
import * as Account from './Account.ui';
import * as Holding from './Holding.ui';
import * as $PiecewiseDetail from './$PiecewiseDetail.ui';
import * as Stock from './Stock.ui';
import * as Blog from './Blog.ui';
import * as StockValue from './StockValue.ui';
import * as AccountValue from './AccountValue.ui';
import * as Portfolio from './Portfolio.ui';
import * as UserBlockStock from './UserBlockStock.ui';
import * as UserAccount from './UserAccount.ui';
import * as UserGroup from './UserGroup.ui';
import * as UserAllStock from './UserAllStock.ui';
import * as AccountHolding from './AccountHolding.ui';
import * as GroupStock from './GroupStock.ui';

export function setUI(uq: Uq) {
	Object.assign(uq.$Piecewise, $Piecewise);
	Object.assign(uq.Market, Market);
	Object.assign(uq.Transaction, Transaction);
	Object.assign(uq.Group, Group);
	Object.assign(uq.Account, Account);
	Object.assign(uq.Holding, Holding);
	Object.assign(uq.$PiecewiseDetail, $PiecewiseDetail);
	Object.assign(uq.Stock, Stock);
	Object.assign(uq.Blog, Blog);
	Object.assign(uq.StockValue, StockValue);
	Object.assign(uq.AccountValue, AccountValue);
	Object.assign(uq.Portfolio, Portfolio);
	Object.assign(uq.UserBlockStock, UserBlockStock);
	Object.assign(uq.UserAccount, UserAccount);
	Object.assign(uq.UserGroup, UserGroup);
	Object.assign(uq.UserAllStock, UserAllStock);
	Object.assign(uq.AccountHolding, AccountHolding);
	Object.assign(uq.GroupStock, GroupStock);
}
export * from './BruceYuMi';
