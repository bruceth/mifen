/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import * as React from 'react';
import { observer } from 'mobx-react';
import RC2 from 'react-chartjs2'
import { VPage, Page, View, List, LMR, FA } from 'tonva-react';
import { CPredictHistory } from './CPredictHistory';

export class VPredictHistory extends VPage<CPredictHistory> {
  async open(param?: any) {
    this.openPage(this.page);
  }

  render(param: any): JSX.Element {
    return <this.page />
  }

  private page = observer(() => {
    return <Page header="预期收益比均值历史">
      <this.pageContent />
    </Page>;
  })

  private pageContent = observer(() => {
    return <>
    <this.historyChart />
    </>
  });

  protected historyChart = observer(() => {
    let {items} = this.controller;
    if (items === undefined) 
      return <></>;
    let chartHistory = <></>;
    let labelList:any[] = [];
    let avg20List:number[] = [];
    let avg50List:number[] = [];
    let avg100List:number[] = [];
    for (let item of items) {
      let {day, avg20, avg50, avg100} = item;
      labelList.push(day);
      avg20List.push(avg20);
      avg50List.push(avg50);
      avg100List.push(avg100);
    }
    let chartdata1 = {
      labels: labelList,
      datasets: [
        {
          label: 'avg20',
          data: avg20List,
          borderColor:'blue',
          backgroundColor:'skyBlue',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'avg50',
          data: avg50List,
          borderColor:'red',
          backgroundColor:'pink',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'avg100',
          data: avg100List,
          borderColor:'DarkGreen',
          backgroundColor:'green',
          borderWidth: 1,
          fill: false,
          yAxisID: 'y-axis-1',
        },
      ]
    };
    let options = {
      scales:{
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-1',
        }],       
      }
    }

    chartHistory = <RC2 data={chartdata1} type='line' options={options}/>;
    return <><LMR className="px-3 py-2 bg-white" left={'历史走势'}></LMR>
      <div className="px-3" style={{width:'95%'}}>{chartHistory}</div>
    </>;
  });

}