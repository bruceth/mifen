//=== UqApp builder created on Sun Mar 14 2021 12:25:48 GMT-0400 (GMT-04:00) ===//
import * as BzHelloTonva from './BzHelloTonva';
import * as BruceYuMi from './BruceYuMi';

export interface UQs {
	BzHelloTonva: BzHelloTonva.UqExt;
	BruceYuMi: BruceYuMi.UqExt;
}

export * as BzHelloTonva from './BzHelloTonva';
export * as BruceYuMi from './BruceYuMi';

export function setUI(uqs:UQs) {
	BzHelloTonva.setUI(uqs.BzHelloTonva);
	BruceYuMi.setUI(uqs.BruceYuMi);
}
