/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, List } from 'tonva-react';
import { observer } from 'mobx-react';
import { GFunc } from './GFunc';
import { CStockInfo } from './CStockInfo'
import RC2 from 'react-chartjs-2'

export class VProfilDetail extends VPage<CStockInfo> {
    async open(param?: any) {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let { baseItem } = this.controller;
        let { name, code, day } = baseItem;

        let headStr = name + ' ' + code;
        if (day !== undefined) {
            headStr += ' - ' + day;
        }
        let head = <div >{headStr}</div>
        return <Page header={head}
            headerClassName='bg-primary'>
            {React.createElement(this.pageContent)}
        </Page>;
    })

    private pageContent = observer(() => {
        return <>
            {React.createElement(this.seasonEarning)}
        </>
    });

    private seasonEarning = observer(() => {
        let items = this.controller.seasonData;
        //let items:any[] = [];
        let header = <div className="px-3">
            <div className="px-3 c8">年月</div>
            <div className="px-3 c8 text-right">股本</div>
            <div className="px-3 c8 text-right">营业收入</div>
            <div className="px-3 c8 text-right">营业利润</div>
            <div className="px-3 c8 text-right">净利润</div>
        </div>;
        return <>
            {this.predictChartFullInfo()}
            <div className="px-3 py-1">历年利润表</div>
            <List header={header} loading="..."
                items={items}
                item={{
                    render: (row: { season: number, revenue: number, profit: number, netprofit: number, shares: number, c: number, corg: number }) => {
                        let { season, revenue, profit, netprofit, shares } = row;
                        let ym = GFunc.SeasonnoToYearMonth(season);
                        let a = 0;
                        return <div className="px-3 py-2 d-flex flex-wrap">
                            <div className="px-3 c8">{ym.toString()}</div>
                            <div className="px-3 c8 text-right">{GFunc.numberToFixString(shares, 0)}</div>
                            <div className="px-3 c8 text-right">{GFunc.numberToFixString(revenue, 0)}</div>
                            <div className="px-3 c8 text-right">{GFunc.numberToFixString(profit, 0)}</div>
                            <div className="px-3 c8 text-right">{GFunc.numberToFixString(netprofit, 0)}</div>
                        </div>
                    }
                }}
            />
        </>
    });

    protected predictChartFullInfo = () => {
        let { predictSeasonDataFull } = this.controller;
        let len = predictSeasonDataFull.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let label3 = []
        let netprofit: number[] = [];
        let profit: number[] = [];
        let revenue: number[] = [];

        for (let i = len - 1; i >= 0; --i) {
            let item = predictSeasonDataFull[i];
            if (item.netprofit === undefined)
                continue;
            let l = GFunc.SeasonnoToYearMonth(item.season);
            label.push(l);
            if (i < len - 1) {
                label3.push(l);
            }
            netprofit.push(item.netprofit);
            profit.push(item.profit);
            revenue.push(item.revenue);
        }

        let zzFunc = (e: number[]) => {
            let len = e.length;
            let r: number[] = [];
            let eb = e[0];
            for (let ei = 1; ei < len; ++ei) {
                let eEnd = e[ei];
                let ed = eEnd - eb;
                let eav = (eEnd + eb) / 2;
                if (eav > 0.0001) {
                    r.push(ed * 100 / eav);
                }
                else {
                    r.push(undefined);
                }
                eb = eEnd;
            }
            return r;
        }

        let npZZ = zzFunc(netprofit);
        let pZZ = zzFunc(profit);
        let rZZ = zzFunc(revenue);

        let chartdataFull = {
            labels: label3,
            datasets: [
                {
                    label: '净利润',
                    data: npZZ.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };
        chartdataFull.datasets.push(
            {
                label: '营业利润',
                data: pZZ.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'red',
                backgroundColor: 'pink',
                borderWidth: 1,
                fill: false,
            });
        chartdataFull.datasets.push(
            {
                label: '营业收入',
                data: rZZ.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                borderWidth: 1,
                fill: false,
            });


        let chartdataProfit = {
            labels: label,
            datasets: [
                {
                    label: '净利润',
                    data: netprofit.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };

        chartdataProfit.datasets.push(
            {
                label: '营业利润',
                data: profit,
                borderColor: 'red',
                backgroundColor: 'pink',
                borderWidth: 1,
                fill: false,
            });

        let chartdataRevenue = {
            labels: label,
            datasets: [
                {
                    label: '营业收入',
                    data: revenue,
                    borderColor: 'blue',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };

        return <>
            <RC2 data={chartdataRevenue} type='line' />
            <RC2 data={chartdataFull} type='line' />
            <RC2 data={chartdataProfit} type='line' />
        </>;
    };

}