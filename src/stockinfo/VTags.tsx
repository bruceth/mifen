import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { VPage, Page, FA, List, Form, ItemSchema, StringSchema, UiInputItem, UiSchema, Context, IdSchema, UiIdItem, LMR } from 'tonva';
import { CStockInfo } from './CStockInfo';
import { defaultBlackListTagName, defaultTagName } from 'CMiApp';

export class VTags extends VPage<CStockInfo> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private onSelect = (item: any, isSelected: boolean, anySelected: boolean) => {
    this.controller.onClickSelectTag(item, isSelected);
  }

  private onEditTag = (tag:any, e:React.MouseEvent) => {
    e.preventDefault();
    this.controller.onEditTag(tag);
  }

  private renderTag = (tag: any) => {
    let left = <div className="px-3 py-2 cursor-pointer">{tag.name}</div>;
    let fdTag = tag.name === defaultBlackListTagName || tag.name === defaultTagName;
    let right = fdTag ? '' : <div className="px-3 py-2 cursor-pointer" onClick={(e)=>this.onEditTag(tag, e)}>编辑</div>;
    return <LMR className="mx-3 my-2" left={left} right={right}>
    </LMR>;
  }

  private page = observer(() => {
    let { selectedTags } = this.controller;
    let { tags } = this.controller.cApp;
    let divNewTag = tags.length >= 10 ? '' :
      <div className="px-3 py-2 cursor-pointer" onClick={this.controller.onNewTag}><FA name="plus" className="text-primary" /> &nbsp; 新建分组</div>;
    return <Page header="选择分组" headerClassName="bg-primary">
      {divNewTag}
      <List items={tags} item={{ onSelect: this.onSelect, render: this.renderTag }} selectedItems={selectedTags} />
    </Page>;
  })
}

const schema: ItemSchema[] = [
  { name: 'name', type: 'string', required: true, maxLength: 10 } as StringSchema,
  { name: 'id', type: 'id' } as IdSchema,
  { name: 'submit', type: 'submit', },
];
const uiSchema: UiSchema = {
  items: {
    name: { widget: 'text', label: null, placeholder: '分组名称' } as UiInputItem,
    id: { widget: 'id', visible: false } as UiIdItem,
    submit: { widget: 'button', label: '保存', className: 'btn btn-primary' },
  }
};

export class VNewTag extends VPage<CStockInfo> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    if (await this.controller.onSaveNewTag(context.data)) {
      this.controller.closePage();
    }
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

export class VEditTag extends VPage<CStockInfo> {
  async open(param?: any) {
    this.openPage(this.page, param);
  }

  private onFormButtonClick = async (name: string, context: Context) => {
    if (await this.controller.onSaveTag(context.data)) {
      this.controller.closePage();
    }
  }

  private page = (param?: any) => {
    let {id, name} = param;
    let fData = {id:id, name:name};
    return <Page header="编辑分组" headerClassName="bg-primary">
      <div className="px-3 py-3">
        <Form schema={schema}
          uiSchema={uiSchema}
          formData={fData}
          onButtonClick={this.onFormButtonClick}
        />
      </div>
    </Page>;
  }
}
