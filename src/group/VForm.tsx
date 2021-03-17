import { IntSchema, ButtonSchema, UiNumberItem, UiButton, Form, Schema, VPage, UiSchema, Context } from "tonva-react";
import { CGroup } from "./CGroup";

abstract class VForm extends VPage<CGroup> {
	private onCheckValue(value:any): string[] | string {
		if (typeof value !== 'number') return '请输入数字';
    }

	protected get valueLabel(): string {return '股票数量'}

	protected schema: Schema = [
		{ name: 'value', type: 'integer', min: 0 } as IntSchema,
		{ name: 'submit', type: 'submit'} as ButtonSchema,
	];

	protected uiSchema: UiSchema = {
		items: {
			value: {
				widget: 'number',
				min: 0,
				step: 1,
				label: this.valueLabel,
				rules: (value:any) => this.onCheckValue(value),
			} as UiNumberItem,
			submit: {
				widget: 'button', className: 'btn btn-primary w-25', label: '提交', disabled: true,
			} as UiButton,
		}
	}

	protected renderStock(): JSX.Element {
		let {holdingStock} = this.controller;
		if (!holdingStock) return null;
		let {stockObj, quantity} = holdingStock;
		let {name, code, miRate, price} = stockObj;
		return <div className="py-2">
			<div className="mr-auto">
				<b>{name}</b> <span className="ml-2 small text-muted">{code}</span>
			</div>
			<div className="d-flex my-2 py-2 border-top border-bottom">
				{this.renderValue('股数', quantity)}
				{this.renderValue('米值', quantity * miRate, 2)}
				{this.renderValue('市值', quantity * (price as number), 2)}
			</div>
		</div>;
	}

	private renderValue(caption:string, value: number, dec: number = 0) {
		return <div className="text-right ml-3 ml-sm-5">
			<div className="small text-muted">{caption}</div>
			<div>{value.toFixed(dec)}</div>
		</div>;
	}

	protected beforeRender() {}

	protected renderForm(): JSX.Element {
		this.beforeRender();
		return <Form
			onButtonClick={this.onFormSubmit}
			onEnter={this.onFormSubmit}
			fieldLabelSize={2}
			schema={this.schema}
			uiSchema={this.uiSchema} />;
	}

	private onFormSubmit = async (name:string, context: Context):Promise<void> => {
		await this.onSubmit(context.data['value']);
		this.closePage();
	}

	protected async onSubmit(value:number): Promise<void> {
		await this.controller.submitBuy(value);
	}

	content() {
		return <div className="m-3">
			{this.renderStock()}
			{this.renderForm()}
		</div>;
	}
}

export class VBuyNew extends VForm {
	header() {return '新买股票'}
}

class VStock extends VForm {
}

export class VBuy extends VStock {
	header() {return '加买股票'}
}

export class VSell extends VStock {
	header() {return '卖出股票'}
}

class VCash extends VForm {
	protected get valueLabel(): string {return '资金数量'}
	protected renderStock(): JSX.Element {return null}
}

export class VCashIn extends VCash {
	header() {return '调入资金'}
	protected async onSubmit(value:number): Promise<void> {
		await this.controller.submitCashIn(value);
	}
}

export class VCashOut extends VCash {
	header() {return '调出资金'}
	protected async onSubmit(value:number): Promise<void> {
		await this.controller.submitCashOut(value);
	}
}

export class VCashAdjust extends VCash {
	header() {return '调整资金'}
	protected beforeRender() {
		(this.schema[0] as IntSchema).min = undefined;
	}
	protected async onSubmit(value:number): Promise<void> {
		await this.controller.submitCashAdjust(value);
	}
}
