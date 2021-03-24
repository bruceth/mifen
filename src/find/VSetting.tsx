import { VPage } from "tonva-react";
import { CFind } from "./CFind";

export class VSetting extends VPage<CFind> {
	header() {
		return '选项设置';
	}
	content() {
		let v = 10-this.controller.smooth;
		return <div className="p-3">
			<div className="mb-3 row">
				<label className="col-sm-3 col-form-label" htmlFor="find-setting-range">业绩稳定</label>
    			<div className="col-sm-9">
					<div className="d-flex align-items-center">
						<span className="small mr-3">稳定</span>
						<input className="form-range w-100 my-3" type="range" 
							min="0" max="10" step="1" 
							name="find-setting-range"
							id="find-setting-range" 
							defaultValue={v}
							onChange={this.onChange} />
						<span className="small ml-3">全部</span>
					</div>
					<div className="text-center mb-2">
						<output id="find-setting-range-value" htmlFor="find-setting-range">{v}</output>
					</div>
					<div className="text-muted">波动值0，屏蔽大多数。波动值10，则不屏蔽</div>
				</div>
			</div>
	    </div>
	}

	private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let {value} = e.currentTarget
		this.controller.changeSmooth(10-Number(value));
		let output: HTMLOutputElement = document.getElementById('find-setting-range-value') as HTMLOutputElement;
		output.value = value;
	}
}