import * as React from 'react';
import { View } from 'tonva-react';
import { CHome } from './CHome';
import { SearchBox } from 'tonva-react';

export class VSearchHeader extends View<CHome> {

    private onSearch = async (key: string) => {
        // let { cProduct } = this.controller.cApp;
        // cProduct.start(key);
    }

    render(param: any) {
        return <SearchBox className="px-1 w-100" 
            size={param}
            onSearch={this.onSearch} 
            placeholder="功能..." />
    }
}