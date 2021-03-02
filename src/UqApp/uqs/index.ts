//=== UqApp builder created on Mon Mar 01 2021 18:29:25 GMT-0500 (GMT-05:00) ===//
import * as BruceYuMi from './BruceYuMi';

export interface UQs {
	BruceYuMi: BruceYuMi.UqExt;
}

export * as BruceYuMi from './BruceYuMi';

export function setUI(uqs:UQs) {
	BruceYuMi.setUI(uqs.BruceYuMi);
}
