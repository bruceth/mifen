/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import classNames from 'classnames';
import { VPage, Page, View, List, LMR, left0, FA } from 'tonva';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import RC2 from 'react-chartjs2'
import { GFunc } from '../tool/GFunc';
import {CMarketPE } from './CMarketPE'

export class VMarketPE extends VPage<CMarketPE> {
  private input: HTMLInputElement;
  private key: string = undefined;

  async open(param?: any) {
    this.openPage(this.page);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  checkLimitShow = (e)=> {
    let check = e.target.checked as boolean;
    let f = check ? 1:0;
    this.controller.onLongShortFlag(f);
  }

  private page = observer(() => {
  let head = <div >{''}</div>
    return <Page header={head}
      headerClassName='bg-primary'>
      <this.pageContent />
    </Page>;
  })

  private pageContent = observer(() => {
    return <>
      <this.historyChart />
    </>
  });

  protected historyChart = observer(() => {
    let {historyData} = this.controller;
    if (historyData === undefined) 
      return <></>;
    let chartHistory = <></>;
    let labelList:any[] = [];
    let peList:number[] = [];
    let eList:number[] = [];
    for (let item of historyData) {
      let {day, pe, e} = item;
      labelList.push(day);
      peList.push(GFunc.numberToPrecision(pe, 4));
      eList.push(e);
    }
    let chartdata1 = {
      labels: labelList,
      datasets: [
        {
          label: 'PE',
          data: peList,
          borderColor:'blue',
          backgroundColor:'skyBlue',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'e',
          data: eList,
          borderColor:'red',
          backgroundColor:'pink',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y-axis-2',
        }
      ]
    };
    let options = {
      scales:{
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-1',
        }, {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-2',
          gridLines: {
              drawOnChartArea: false
          }
        }],    
      }
    }
    chartHistory = <RC2 data={chartdata1} type='line' options={options} />;
    let right = <></>;
    right = <label className="px-3"> <input type="checkbox" name="selectType" defaultChecked={false}
    onChange={this.checkLimitShow} />长期</label>;
    return <><LMR className="px-3 py-2 bg-white" left={'市场PE历史走势'} right={right}></LMR>
      <div className="px-3" style={{width:'95%'}}>{chartHistory}</div>
    </>;
  });


}