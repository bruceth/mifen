import * as React from 'react';
import { View, nav } from 'tonva';
import { LMR, FA, SearchBox } from 'tonva';
import logo from '../images/logo.svg';
import { CHome } from './CHome';

export class VSiteHeader extends View<CHome> {
    render() {
        let currentSalesRegion = <FA name="globe" />
        let login = <div>
            登录
        </div>
        let left = <img className="m-1" src={logo} alt="logo" style={{height: "3rem", width: "3rem"}} />;
        //let cart = this.controller.cApp.cCart.renderCartLabel();
        let right = undefined;
        /*
        <div className="d-flex flex-row mr-1 align-items-center">
            {currentSalesRegion} &nbsp;
            <button onClick={()=>nav.start()}>Try</button>
        </div>;*/
        return <LMR
            className="mb-3 align-items-center bg-white"
            left={left} right={right}>
            <div className="">
                {this.controller.renderSearchHeader('md')}
            </div>
        </LMR>
    }
}