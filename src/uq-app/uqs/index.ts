//=== UqApp builder created on Fri Mar 12 2021 22:25:11 GMT-0500 (GMT-05:00) ===//
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
