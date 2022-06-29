/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, List } from 'tonva-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import RC2 from 'react-chartjs-2'
import { CMirateAvg } from './CMirateAvg';
import { GFunc } from 'stockinfo';

export class VMirateAvg extends VPage<CMirateAvg> {
    async open(param?: any) {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let headStr = 'A股历史米息率';
        let head = <div >{headStr}</div>
        return <Page header={head}
            headerClassName='bg-primary'>
            {React.createElement(this.miratesChart)}
        </Page>;
    })

    protected miratesChart = observer(() => {
        let { mirates } = this.controller;
        let len = mirates.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let y1: number[] = [];
        let y2: number[] = [];
        let y3: number[] = [];
        for (let i = 0; i < len; ++i) {
            let item = mirates[i];
            label.push(item.day);
            y1.push(GFunc.numberToPrecision(item.avg1));
            y2.push(GFunc.numberToPrecision(item.avg2));
            y3.push(GFunc.numberToPrecision(item.avg3));
        }

        let chartdataFull = {
            labels: label,
            datasets: [
                {
                    label: '1-40',
                    data: y1,
                    borderColor: 'red',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                } as any,
                {
                    label: '41-80',
                    data: y2,
                    borderColor: 'blue',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                } as any,
                {
                    label: '81-120',
                    data: y3,
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                } as any,
            ]
        };
        return <RC2 data={chartdataFull} type='line' />;
    });
}