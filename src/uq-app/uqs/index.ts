//=== UqApp builder created on Tue Mar 23 2021 11:34:08 GMT-0400 (GMT-04:00) ===//
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
