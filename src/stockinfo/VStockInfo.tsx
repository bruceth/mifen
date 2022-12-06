/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { VPage, Page, List } from 'tonva-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import RC2 from 'react-chartjs-2'
import { GFunc } from './GFunc';
import { CStockInfo } from './CStockInfo'
import { StockCapitalearning, StockBonus } from './StockInfoType';
import { renderStockRow } from 'tool';
import { ErForEarning } from './ErForEarning';
import { SlrForEarning } from './SlrForEarning';

export class VStockInfo extends VPage<CStockInfo> {
    private input: HTMLInputElement;
    private key: string = undefined;

    async open(param?: any) {
        this.openPage(this.page);
    }

    @observable protected ttmLimit: boolean = false;

    render(param: any): JSX.Element {
        return this.page();
    }

    checkLimitShow = (e: any) => {
        let check = e.target.checked as boolean;
        this.ttmLimit = check;
    }

    checkShowLater = (e: any) => {
        let check = e.target.checked as boolean;
    }

    private page = observer(() => {
        let { openMetaView, baseItem, isLogined } = this.controller;
        let { name, code, day } = baseItem;
        let viewMetaButton = <></>;
        if (isLogined) {
            viewMetaButton = <button type="button" className="btn w-100" onClick={openMetaView}>view</button>
        }

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
            {React.createElement(this.baseInfo)}
            {React.createElement(this.miratesChart)}
            {React.createElement(this.mivaluesChart)}
            {React.createElement(this.bonusInfo)}
            {React.createElement(this.predictInfo)}
            {React.createElement(this.profitInfo)}
        </>
    });

    private onChange = (evt: React.ChangeEvent<any>) => {
        let v = evt.target.value;
        let n = Number(v);
        if (isNaN(n) === true || !Number.isInteger(n)) {
            if (this.input) {
                this.input.value = this.key;
            }
            return;
        }
        this.key = evt.target.value;
        if (this.key !== undefined) {
            this.key = this.key.trim();
            if (this.key === '') this.key = undefined;
        }
    }

    private baseInfo = observer(() => {
        let { stock, baseItem } = this.controller;
        let { cCommon } = this.controller.cApp;
        let pinStock = <div className="d-flex align-self-stretch align-items-center">
            {cCommon.renderStockLink(stock)}
            &nbsp;
            {cCommon.renderPinStock(stock, 2)}
            &nbsp;
            {cCommon.renderBlockStock(stock)}
        </div>;
        return <div className="bg-white">{renderStockRow(undefined, stock, undefined, pinStock)}</div>;
    });


    protected predictInfo = observer(() => {
        let { predictData, ypredict } = this.controller;
        if (predictData === undefined)
            return <></>;
        let { e, b, r2, epre, l, lr2, lpre } = predictData;
        let chart1 = <></>;
        if (ypredict.length === 5) {
            let er = new ErForEarning(ypredict);
            let chartdata1 = {
                labels: ['0', '1', '2', '3', '4'],
                datasets: [
                    {
                        label: '收益原值',
                        data: ypredict.map(v => GFunc.numberToPrecision(v)),
                        borderColor: 'black',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 1,
                        pointRadius: 5,
                        fill: false,
                    } as any
                ]
            };
            if (!(isNaN(er.B) || isNaN(er.A))) {
                let per: number[] = [];
                for (let i = 0; i < 5; ++i) {
                    per.push(GFunc.numberToPrecision(er.predict(i), 4));
                }
                chartdata1.datasets.push(
                    {
                        label: '指数回归',
                        data: per,
                        borderColor: 'red',
                        backgroundColor: 'pink',
                        borderWidth: 1,
                        fill: false,
                    });
            }
            let lr = new SlrForEarning(ypredict);
            if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
                let plr: number[] = [];
                for (let i = 0; i < 5; ++i) {
                    plr.push(GFunc.numberToPrecision(lr.predict(i), 4));
                }
                chartdata1.datasets.push(
                    {
                        label: '线性回归',
                        data: plr,
                        borderColor: 'blue',
                        backgroundColor: 'pink',
                        borderWidth: 1,
                        fill: false,
                    });
            }
            chart1 = <RC2 data={chartdata1} type='line' />;
        }
        return <>
            <div className="d-flex">
                <div className="d-flex">
                    <div className="px-3 py-2 bg-white">指数回归预测</div>
                    <div className="d-flex flex-wrap align-items-center">
                        <div className="px-3 c12">{GFunc.caption('e')}{GFunc.numberToString(e, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('指数b')}{GFunc.numberToString(b, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('r2')}{GFunc.numberToString(r2, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('e预测')}{GFunc.numberToString(epre)}</div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="px-3 py-2 bg-white">线性回归预测</div>
                    <div className="d-flex flex-wrap align-items-center">
                        <div className="px-3 c12">{GFunc.caption('e')}{GFunc.numberToString(e, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('增长率')}{GFunc.numberToString(l, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('r2')}{GFunc.numberToString(lr2, 4)}</div>
                        <div className="px-3 c12">{GFunc.caption('e预测')}{GFunc.numberToString(lpre)}</div>
                    </div>
                </div>
            </div>
            <div className="col">{chart1}</div>
        </>;
    });

    protected profitInfo = observer(() => {
        let { chartFull, chartProfit, chartRevenue } = this.getProfitCharts();
        let chartRoe = this.predictChartROE();
        return <>
            <div className="px-3 py-1 bg-white cursor-pointer text-primary" onClick={() => this.controller.showProfit()} >营收利润&gt;&gt;</div>
            <div className="row">
                <div className="col">{chartRevenue}</div>
                <div className="col">{chartFull}</div>
            </div>
            <div className="row">
                <div className="col">{chartProfit}</div>
                <div className="col">{chartRoe}</div>
            </div>
        </>
    });


    protected getProfitCharts = () => {
        let { predictSeasonDataFull } = this.controller;
        let len = predictSeasonDataFull.length;
        if (len <= 0)
            return { chartFull: <></>, chartProfit: <></>, chartRevenue: <></> };

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

        return {
            chartFull: <RC2 data={chartdataFull} type='line' />,
            chartProfit: <RC2 data={chartdataProfit} type='line' />,
            chartRevenue: <RC2 data={chartdataRevenue} type='line' />
        };
    };

    protected predictChartROE = () => {
        let { predictSeasonDataFull } = this.controller;
        let len = predictSeasonDataFull.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let y: number[] = [];
        for (let i = len - 1; i >= 0; --i) {
            let item = predictSeasonDataFull[i];
            if (item.netprofit === undefined)
                continue;
            label.push(GFunc.SeasonnoToYearMonth(item.season));
            y.push(item.netprofit / item.shares / item.c);
        }

        let chartdataFull = {
            labels: label,
            datasets: [
                {
                    label: 'ROE原值',
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
        return <RC2 data={chartdataFull} type='line' />;
    };

    protected bonusInfo = observer(() => {
        return <>
            <div className="px-3 py-1 bg-white cursor-pointer text-primary" onClick={() => this.controller.showBonus()} >分红信息&gt;&gt;</div>
            {this.chartBonus()}
        </>
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

    protected miratesChart = observer(() => {
        let { mirates } = this.controller;
        let len = mirates.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let y: number[] = [];
        let priceList: number[] = [];
        let priceOrg: number[] = [];
        let price60: number[] = [];
        let price20: number[] = [];
        let sum20: number = 0;
        let sum60: number = 0;
        for (let i = 0; i < len; ++i) {
            let item = mirates[i];
            if (item.day === undefined)
                continue;
            label.push(item.day);
            priceOrg.push(item.price);
            sum20 += item.price;
            sum60 += item.price;
            if (priceOrg.length >= 20) {
                price20.push(GFunc.numberToPrecision(sum20/20));
                sum20 -= priceOrg[priceOrg.length - 20];
            }
            else {
                price20.push(undefined);
            }
            if (priceOrg.length >= 60) {
                price60.push(GFunc.numberToPrecision(sum60/60));
                sum60 -= priceOrg[priceOrg.length - 60];
            }
            else {
                price60.push(undefined);
            }
            y.push(GFunc.numberToPrecision(item.mirate));
            priceList.push(GFunc.numberToPrecision(item.price));
        }

        let chartdataFull = {
            labels: label,
            datasets: [
                {
                    label: '价格',
                    data: priceList,
                    borderColor: 'navy',
                    backgroundColor: 'pink',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-1',
                },
                {
                    label: 'MA20',
                    data: price20,
                    borderColor: 'violet',
                    backgroundColor: 'pink',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-1',
                },
                {
                    label: 'MA60',
                    data: price60,
                    borderColor: 'limegreen',
                    backgroundColor: 'pink',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-1',
                },
                {
                    label: '米息率',
                    data: y,
                    borderColor: 'magenta',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 3,
                    pointRadius: 1,
                    fill: false,
                    yAxisID: 'y-axis-2',
                }
            ]
        };
        let options = {
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }, {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        drawOnChartArea: false
                    }
                }],
            }
        }

        return <RC2 data={chartdataFull} type='line' options={options} />;
    });

    protected mivaluesChart = observer(() => {
        let { mivalues } = this.controller;
        let len = mivalues.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let y: number[] = [];
        for (let i = 0; i < len; ++i) {
            let item = mivalues[i];
            if (item.season === undefined)
                continue;
            label.push(GFunc.SeasonnoToYearMonth(item.season));
            y.push(item.mivalue);
        }

        let chartdataFull = {
            labels: label,
            datasets: [
                {
                    label: '米息',
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
        return <RC2 data={chartdataFull} type='line' />;
    });

    // private predictSeasonEarning = observer(() => {
    //     //let items = this.controller.predictSeasonData;
    //     let items: any[] = [];
    //     let header = <div className="px-3">
    //         <div className="px-3 c6">年月</div>
    //         <div className="px-3 c6 text-right">股本</div>
    //         <div className="px-3 c6 text-right">季收益</div>
    //         <div className="px-3 c6 text-right">年收益</div>
    //         <div className="px-3 c6 text-right">ROE</div>
    //         <div className="px-3 c6 text-right">股本o</div>
    //         <div className="px-3 c6 text-right">季收益o</div>
    //         <div className="px-3 c6 text-right">年收益o</div>
    //     </div>;
    //     return <>
    //         <div className="px-3 py-1">历年股本收益-用于回归计算</div>
    //         <List header={header} loading="..."
    //             items={items}
    //             item={{
    //                 render: (row: { season: number, c: number, e: number, esum: number, corg: number, eorg: number, esumorg: number }) => {
    //                     let { season, c, e, esum, corg, eorg, esumorg } = row;
    //                     let ym = GFunc.SeasonnoToYearMonth(season);
    //                     let a = 0;
    //                     return <div className="px-3 py-2 d-flex flex-wrap">
    //                         <div className="px-3 c6">{ym.toString()}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(c)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(e)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(esum)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.percentToFixString(esum / c)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(corg)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(eorg)}</div>
    //                         <div className="px-3 c6 text-right">{GFunc.numberToFixString(esumorg)}</div>
    //                     </div>
    //                 }
    //             }}
    //         />
    //     </>
    // });

    // private seasonEarning = observer(() => {
    //     return <>
    //         <div className="px-3 py-1" onClick={()=>this.controller.showProfit()} >历年利润表</div>
    //     </>
    // });
}