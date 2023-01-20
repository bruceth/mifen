/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, List } from 'tonva-react';
import { observer } from 'mobx-react';
import { CStockInfo } from './CStockInfo'
import { StockBonus } from './StockInfoType';
import RC2 from 'react-chartjs-2'
import { GFunc } from './GFunc';
import { SlrForEarning } from './SlrForEarning';

export class VBonusDetail extends VPage<CStockInfo> {
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
            {React.createElement(this.bonus)}
        </>
    });

    private bonus = observer(() => {
        let { bonus, dividentOrg, baseItem } = this.controller;
        if (dividentOrg.length > 0) {
            let header = <div className="px-3">
                <div className="px-3 c8">报期</div>
                <div className="px-3 c6 text-right">分红</div>
                <div className="px-3 c6 text-right">除权日期</div>
            </div>;
            let url = `https://xueqiu.com/snowman/S/${baseItem.symbol}/detail#/FHPS`;
            return <>
                <a className="px-3 py-1 btn btn-sm btn-link d-sm-inline d-none" href={url} target="_blank" rel="noreferrer">雪球分红信息</a>
                {this.chartBonus()}
                <div className="px-3 py-1">历年分红</div>
                <List header={header} loading="..."
                    items={dividentOrg.slice().reverse()}
                    item={{
                        render: (row: { year: number, season: string, divident: number, day: number }) => {
                            return <div className="px-3 py-2 d-flex flex-wrap">
                                <div className="px-3 c8">{`${row.year}${row.season}`}</div>
                                <div className="px-3 c6 text-right"> {row.divident.toFixed(3)}</div>
                                <div className="px-3 c6 text-right"> {row.day}</div>
                            </div>
                        }
                    }}
                />
            </>
        }
        else {
            let header = <div className="px-3">
                <div className="px-3 c8">日期</div>
                <div className="px-3 c6 text-right">分红</div>
            </div>;
            return <>
                {this.chartBonus()}
                <div className="px-3 py-1">历年分红</div>
                <List header={header} loading="..."
                    items={bonus}
                    item={{
                        render: (row: StockBonus) => {
                            return <div className="px-3 py-2 d-flex flex-wrap">
                                <div className="px-3 c8">{row.day}</div>
                                <div className="px-3 c6 text-right"> {row.bonus.toFixed(3)}</div>
                            </div>
                        }
                    }}
                />
            </>
        }
    });

    protected chartBonus = () => {
        let { predictBonusData, dividents } = this.controller;
        if (dividents !== undefined) {
            let len = dividents.length;
            if (len <= 0)
                return <></>;
            let label = [];
            let y: number[] = [];
            let y3: number[] = [];
            for (let i = 0; i < len; ++i) {
                let item = dividents[i];
                label.push(item.year);
                y.push(GFunc.numberToPrecision(item.divident));
                y3.push(GFunc.numberToPrecision(item.d3));
            }

            let chartdataFull = {
                labels: label,
                datasets: [
                    {
                        label: '每年分红',
                        data: y,
                        borderColor: 'black',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 1,
                        pointRadius: 5,
                        fill: false,
                    } as any,
                    {
                        label: '3年均值',
                        data: y3,
                        borderColor: 'magenta',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 3,
                        pointRadius: 5,
                        fill: false,
                    } as any
                ]
            };
            if (y.length >= 3) {
                let lr = new SlrForEarning(y);
                if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
                    let plr: number[] = [];
                    for (let i = 0; i < len; ++i) {
                        plr.push(Number.parseFloat(lr.predict(i).toPrecision(4)));
                    }
                    chartdataFull.datasets.push(
                        {
                            label: '线性 R2:' + GFunc.numberToString(lr.r2, 4),
                            data: plr,
                            borderColor: 'blue',
                            backgroundColor: 'pink',
                            borderWidth: 1,
                            fill: false,
                        });
                }
            }
            return <RC2 data={chartdataFull} type='line' />;
        }
        else {
            let len = predictBonusData.length;
            if (len <= 0)
                return <></>;
            let label = [];
            let y: number[] = [];
            for (let i = 0; i < len; ++i) {
                let item = predictBonusData[i];
                if (item.bonus === undefined)
                    continue;
                label.push(item.year);
                y.push(item.bonus);
            }

            let chartdataFull = {
                labels: label,
                datasets: [
                    {
                        label: '分红原值',
                        data: y.map(v => GFunc.numberToPrecision(v)),
                        borderColor: 'black',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 1,
                        pointRadius: 5,
                        fill: false,
                    } as any
                ]
            };
            if (y.length >= 3) {
                let lr = new SlrForEarning(y);
                if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
                    let plr: number[] = [];
                    for (let i = 0; i < len; ++i) {
                        plr.push(Number.parseFloat(lr.predict(i).toPrecision(4)));
                    }
                    chartdataFull.datasets.push(
                        {
                            label: '线性 R2:' + GFunc.numberToString(lr.r2, 4),
                            data: plr,
                            borderColor: 'blue',
                            backgroundColor: 'pink',
                            borderWidth: 1,
                            fill: false,
                        });
                }
            }
            return <RC2 data={chartdataFull} type='line' />;
        }
    };

}