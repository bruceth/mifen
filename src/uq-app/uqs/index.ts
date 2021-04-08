//=== UqApp builder created on Thu Apr 08 2021 10:28:58 GMT-0400 (GMT-04:00) ===//
import * as BruceYuMi from './BruceYuMi';

export interface UQs {
	BruceYuMi: BruceYuMi.UqExt;
}

export * as BruceYuMi from './BruceYuMi';

export function setUI(uqs:UQs) {
	BruceYuMi.setUI(uqs.BruceYuMi);
}
