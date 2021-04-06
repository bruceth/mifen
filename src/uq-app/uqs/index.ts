//=== UqApp builder created on Mon Apr 05 2021 23:32:57 GMT-0400 (GMT-04:00) ===//
import * as BruceYuMi from './BruceYuMi';

export interface UQs {
	BruceYuMi: BruceYuMi.UqExt;
}

export * as BruceYuMi from './BruceYuMi';

export function setUI(uqs:UQs) {
	BruceYuMi.setUI(uqs.BruceYuMi);
}
