import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context } from 'tonva';
import { CStockInfo } from './CStockInfo';

export class VTags extends VPage<CStockInfo> {
    async open(param?: any) {
        this.openPage(this.page);
    }

    private onSelect = (item:any, isSelected:boolean, anySelected:boolean) => {
        this.controller.onTaged(item, isSelected);
    }

    private renderTag = (tag:any) => {
        return <div className="px-3 py-2 cursor-pointer">{tag.name}</div>;
    }

    private page = observer(() => {
        let {tags, selectedTags} = this.controller;
        return <Page header="选择分组" headerClassName="bg-primary">
            <div className="px-3 py-2 cursor-pointer" onClick={this.controller.onNewTag}><FA name="plus" className="text-primary" /> &nbsp; 新建分组</div>
            <List items={tags} item={{onSelect:this.onSelect, render:this.renderTag}} selectedItems={selectedTags} />
        </Page>;
    })
}

const schema:ItemSchema[] = [
    {name: 'name', type: 'string', required: true, maxLength: 10} as StringSchema,
    {name: 'submit', type: 'submit', } ,
];
const uiSchema:UiSchema = {
    items: {
        name: { widget: 'text', label: null, placeholder: '分组名称' } as UiInputItem,
        submit: { widget: 'button', label: '保存', className:'btn btn-primary' },
    }
};

export class VNewTag extends VPage<CStockInfo> {
    async open(param?: any) {
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name:string, context: Context) => {
        await this.controller.onSaveNewTag(context.data);
    }

    private page = () => {
        return <Page header="新建分组" headerClassName="bg-primary">
            <div className="px-3 py-3">
                <Form schema={schema}
                    uiSchema={uiSchema}
                    formData={undefined}
                    onButtonClick={this.onFormButtonClick}
                />
            </div>
        </Page>;
    }
}
