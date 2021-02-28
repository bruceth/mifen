//=== UqApp builder created on Mon Feb 15 2021 23:34:19 GMT-0500 (GMT-05:00) ===//
import { CSub, CBase, CAppBase, IConstructor } from 'tonva';
//import { UQs } from './uqs';
//import { CApp } from './CApp';

export abstract class CUqBase extends CBase {
}

export abstract class CUqSub extends CSub<any> {
}

export abstract class CUqApp extends CAppBase {
	protected newC<T extends CUqBase>(type: IConstructor<T>): T {
		let c = new type(this);
		c.init();
		return c;
	}
}
