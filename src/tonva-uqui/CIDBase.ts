import { makeObservable, observable } from "mobx";
import { IDBase } from "tonva-uqui";
import { CUqUi, IDBaseUiProps } from "./props";

export abstract class CIDBase<T extends IDBase, P extends IDBaseUiProps<T>> extends CUqUi<P> {
	item: T;
	constructor(props: P) {
		super(props);
		makeObservable(this, {
			item: observable,
		})
	}
}
