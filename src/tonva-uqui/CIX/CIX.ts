import { IDBase } from "../base";
import { CIDList } from "../CIDList";
import { CIXList } from "../CIXList";
import { CUqUi, IXUiProps } from "../props";

export class CIX<TIX extends IDBase, TXI extends IDBase>  extends CUqUi<IXUiProps<TIX, TXI>> {
	protected async internalStart() {
		let ixProps = {
			...this.props.ixProps, 
			onClickItem: async (item:TIX) => {
				let xiProps = {
					...this.props.xiProps,
					ix: item,
				};
				let cXIList = new CIXList(xiProps);
				await cXIList.start();
			}
		};
		let cIXList = new CIDList(ixProps);		
		await cIXList.start();
	}
}
