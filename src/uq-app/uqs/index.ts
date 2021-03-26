//=== UqApp builder created on Fri Mar 26 2021 12:16:51 GMT-0400 (GMT-04:00) ===//
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
