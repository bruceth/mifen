//=== UqApp builder created on Wed Apr 07 2021 14:53:42 GMT-0400 (GMT-04:00) ===//
import * as BruceYuMi from './BruceYuMi';

export interface UQs {
	BruceYuMi: BruceYuMi.UqExt;
}

export * as BruceYuMi from './BruceYuMi';

export function setUI(uqs:UQs) {
	BruceYuMi.setUI(uqs.BruceYuMi);
}
