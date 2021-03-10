/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { LMR, View } from 'tonva-react';
import logo from '../images/logo.svg';
import { CExplorer } from './CExplorer';

export class VSiteHeader extends View<CExplorer> {
    render() {
        let left = <img className="m-1" src={logo} alt="logo" style={{height: "3rem", width: "3rem"}} />;
        let right = undefined;
        return <LMR
            className="mb-3 align-items-center bg-white"
            left={left} right={right}>
            <div className="">
                {this.controller.renderSiteHeader()}
            </div>
        </LMR>
    }
}