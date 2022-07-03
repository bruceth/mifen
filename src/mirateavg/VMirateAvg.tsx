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
        let close1: number[] = [];
        let close300: number[] = [];
        let close399001: number[] = [];
        let close399006: number[] = [];

        for (let i = 0; i < len; ++i) {
            let item = mirates[i];
            label.push(item.day);
            y1.push(GFunc.numberToPrecision(item.avg1));
            y2.push(GFunc.numberToPrecision(item.avg2));
            y3.push(GFunc.numberToPrecision(item.avg3));
            close1.push(GFunc.numberToPrecision(item.close1, 2));
            close300.push(GFunc.numberToPrecision(item.close300, 2));
            close399001.push(GFunc.numberToPrecision(item.close399001, 2));
            close399006.push(GFunc.numberToPrecision(item.close399006, 2));
        }

        let chartdataFullSH = {
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
                } as any,
                {
                    label: '上证指数',
                    data: close1,
                    borderColor: 'Magenta',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-2',
                } as any,
            ]
        };
        let chartdataFullSZ = {
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
                } as any,
                {
                    label: '深证成指',
                    data: close399001,
                    borderColor: 'Magenta',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-2',
                } as any,
            ]
        };
        let chartdataFull300 = {
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
                } as any,
                {
                    label: '沪深300',
                    data: close300,
                    borderColor: 'Magenta',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-2',
                } as any,
            ]
        };
        let chartdataFullCY = {
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
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
                    yAxisID: 'y-axis-1',
                } as any,
                {
                    label: '创业板指',
                    data: close399006,
                    borderColor: 'Magenta',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-2',
                } as any,
            ]
        };
        let options = {
            scales: {
                yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'right',
                        id: 'y-axis-1',
                    },
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-2',
                        gridLines: {
                            drawOnChartArea: false
                        }
                    },
                ],
            }
        }

        return <>
        <RC2 data={chartdataFullSH} type='line' options={options} />
        <RC2 data={chartdataFullSZ} type='line' options={options} />
        <RC2 data={chartdataFull300} type='line' options={options} />
        <RC2 data={chartdataFullCY} type='line' options={options} />
        </>;
    });
}