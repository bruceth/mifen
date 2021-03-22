import { IntSchema, ButtonSchema, UiNumberItem, UiButton, Form, Schema, VPage, UiSchema, Context, NumSchema, IdSchema, UiIdItem } from "tonva-react";
import { formatNumber } from "tool";
import { Stock } from "uq-app/uqs/BruceYuMi";
import { CAccount } from "./CAccount";

abstract class VForm extends VPage<CAccount> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	protected onCheckValue(value:any): string[] | string {
		return;
    }

	protected get valueLabel(): string {return '股票数量'}
	protected get placeholder(): string {return '股票数量'}

	protected schema: Schema = [
		{ name: 'value', type: 'integer', min: 0, required: true } as IntSchema,
		{ name: 'submit', type: 'submit'} as ButtonSchema,
	];

	protected uiSchema: UiSchema = {
		items: {
			value: {
				widget: 'number',
				min: 0,
				step: 1,
				label: this.valueLabel,
				placeholder: this.placeholder,
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
		let {name, code, miValue, price} = stockObj;
		return <div className="py-2">
			<div className="mr-auto px-3 mb-2">
				<b>{name}</b> <span className="ml-2 small text-muted">{code}</span>
			</div>
			<div className="d-flex my-2 py-2 border-top border-bottom justify-content-center text-center bg-white">
				{this.renderValue('股数', quantity)}
				{this.renderValue('米值', quantity * miValue, 2)}
				{this.renderValue('市值', quantity * (price as number), 2)}
			</div>
		</div>;
	}

	private renderValue(caption:string, value: number, dec: number = 0) {
		return <div className="mx-1 border rounded w-min-5c px-1 py-2">
			<small className="text-muted">{caption}</small>
			<div>{formatNumber(value??0)}</div>
		</div>;
	}

	protected beforeRender() {}

	protected renderForm(): JSX.Element {
		this.beforeRender();
		return <Form className="mx-3"
			onButtonClick={this.onFormSubmit}
			onEnter={this.onFormSubmit}
			fieldLabelSize={3}
			fieldLabelAlign='right'
			schema={this.schema}
			uiSchema={this.uiSchema} />;
	}

	private onFormSubmit = async (name:string, context: Context):Promise<void> => {
		await this.onSubmit(context.data);
		this.closePage();
	}

	protected abstract onSubmit(data:any): Promise<void>;

	content() {
		return <div className="my-3">
			{this.renderStock()}
			{this.renderForm()}
		</div>;
	}
}

abstract class VStock extends VForm {
	protected beforeRender() {
		super.beforeRender();
		this.schema.unshift(
			{ name: 'price', type: 'number', min: 0, required: true } as NumSchema,
		);
		this.uiSchema.items['price'] = {
			widget: 'number',
			min: 0,
			step: 1,
			label: '价格',
			placeholder: '股票价格',
			defaultValue: this.controller.holdingStock?.stockObj.price
			//rules: (value:any) => this.onCheckValue(value),
		} as UiNumberItem;
	}
}

abstract class VBuy extends VStock {
	protected beforeRender() {
		super.beforeRender();
		this.uiSchema.rules = [this.checkCash];
	}
	protected checkCash = (context:Context): string[] | string => {
		let {holdingStock, miAccount} = this.controller;
		let {cash} = miAccount;
		if (typeof cash !== 'number') return;
		let {stockObj} = holdingStock;
		let quantity = context.data.quantity;
		let {price} = stockObj;
		if ((quantity as number) * (price as number) > (cash as number))
			return `超过账户资金余额，无法买入`;
    }
}

export class VBuyNew extends VBuy {
	header() {return '新买股票'}
	protected beforeRender() {
		super.beforeRender();
		this.schema.unshift(
			{ name: 'stock', type: 'id', required: true } as IdSchema,
		);
		this.uiSchema.items['stock'] = {
			widget: 'id',
			label: '股票',
			pickId: this.controller.createPickStockId(),
			placeholder: '请选择股票',
			Templet: this.renderStockPick,
		} as UiIdItem;
	}

	private renderStockPick = (values: Stock):JSX.Element => {
		let {name, code} = values;
		return <>{name} <small className="text-muted">{code}</small></>;
	}

	protected async onSubmit(data:any): Promise<void> {
		let {stock, price, value} = data;
		await this.controller.submitBuyNew(stock.id, price, value);
	}
}

export class VBuyExist extends VBuy {
	header() {return '加买股票'}
	protected get placeholder(): string {return '加买数量'}

	protected async onSubmit(data:any): Promise<void> {
		let {price, value} = data;
		await this.controller.submitBuy(price, value);
	}
}

export class VSell extends VStock {
	header() {return '卖出股票'}
	protected get placeholder(): string {return '卖出数量'}
	protected onCheckValue(value:any): string[] | string {
		let {holdingStock} = this.controller;
		let {quantity} = holdingStock;
		if (value > quantity)
			return `现有持股${quantity}，卖出数量超出`;
    }

	protected async onSubmit(data:any): Promise<void> {
		let {price, value} = data;
		await this.controller.submitSell(price, value);
	}
}

abstract class VCash extends VForm {
	protected get valueLabel(): string {return '资金数量'}
	protected renderStock(): JSX.Element {return null}
}

export class VCashInit extends VCash {
	header() {return '期初资金'}
	protected get placeholder(): string {return '期初金额'}
	protected async onSubmit(data:any): Promise<void> {
		let {value} = data;
		await this.controller.submitCashInit(value);
	}
}

export class VCashIn extends VCash {
	header() {return '调入资金'}
	protected get placeholder(): string {return '调入金额'}
	protected async onSubmit(data:any): Promise<void> {
		let {value} = data;
		await this.controller.submitCashIn(value);
	}
}

export class VCashOut extends VCash {
	header() {return '调出资金'}
	protected get placeholder(): string {return '调出金额'}
	protected onCheckValue(value:any): string[] | string {
		let {cash} = this.controller.miAccount; 
		if (value > cash)
			return `调出金额不能超过总现金${cash}`;
    }
	protected async onSubmit(data:any): Promise<void> {
		let {value} = data;
		await this.controller.submitCashOut(value);
	}
}

export class VCashAdjust extends VCash {
	header() {return '调整资金'}
	protected beforeRender() {
		(this.schema[0] as IntSchema).min = undefined;
	}
	protected get placeholder(): string {return '调整金额'}
	protected onCheckValue(value:any): string[] | string {
		let {cash} = this.controller.miAccount; 
		if (value < 0 && -value > cash)
			return `负向调整金额不能超过总现金${cash}`;
    }
	protected async onSubmit(data:any): Promise<void> {
		let {value} = data;
		await this.controller.submitCashAdjust(value);
	}
}
