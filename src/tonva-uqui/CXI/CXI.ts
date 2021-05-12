import { IDBase } from "../base";
import { CIDList } from "../CIDList";
import { CXIList } from "../CXIList";
import { CUqUi, IDListUiProps, XIListUiProps, XIUiProps } from "../props";

export class CXI<TIX extends IDBase, TXI extends IDBase>  extends CUqUi<XIUiProps<TIX, TXI>> {
	protected async internalStart() {
		let xiProps:IDListUiProps<TXI> = {
			...this.props.xiProps, 
			onClickItem: async (item:TXI) => {
				let xiProps:XIListUiProps<TIX, TXI> = {
					...this.props.ixProps,
					xi: item,
				};
				let cXIList = new CXIList(xiProps);
				await cXIList.start();
			},
			renderItem: null,
			onAddItem: null,
		};
		let cXIList = new CIDList(xiProps);
		await cXIList.start();
	}
}
