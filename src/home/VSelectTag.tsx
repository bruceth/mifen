import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { VPage, Page, List } from 'tonva';
import { CHome } from './CHome';

export class VSelectTag extends VPage<CHome> {
    async open(param?: any) {
        this.openPage(this.page);
    }

    private renderTag = (tag:any) => {
        return <div className="px-3 py-2 cursor-pointer">{tag.name}</div>;
    }

    private page = observer(() => {
        let {tags} = this.controller.cApp;
        let { onTaged } = this.controller;
        return <Page header="选择分组" headerClassName="bg-primary">
            <List items={tags} item={{onClick:onTaged, render:this.renderTag}} />
        </Page>;
    })
}
