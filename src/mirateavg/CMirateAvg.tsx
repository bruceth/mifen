/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed, makeObservable } from 'mobx';
import { MiNet } from '../net';
import { CUqBase } from "../uq-app";
import { VMirateAvg } from './VMirateAvg';

export class CMirateAvg extends CUqBase {
    trackDay: number;
    @observable mirates: { day: number, avg1: number, avg2: number, avg3: number }[] = [];

    private miNet: MiNet;
    constructor(cApp: any) {
        super(cApp);
        makeObservable(this);
        this.miNet = new MiNet(this.user);
    }

    initLoad = () => {
        this.load();
    }

    private load = async () => {
        let rets = await this.miNet.t_mirateavgquery(this.trackDay);
        if (!Array.isArray(rets)) {
            return;
        }

        let arr1 = rets[0] as { day: number, avg1: number, avg2: number, avg3: number }[];
        let arr2 = rets[1] as { mirate: number}[];
        if (this.trackDay !== undefined && arr2 !== undefined && arr2.length >= 40) {
            let lastDay: number = undefined;
            if (arr1.length > 0) {
                lastDay = arr1[0].day;
            }
		    let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();
            let day = year*10000 + month*100 + dt;
            if (day > lastDay) {
                let ni : { day: number, avg1: number, avg2: number, avg3: number } = { day: day,  avg1: undefined, avg2: undefined, avg3: undefined };
                let len = arr2.length;
                let getavg = (b: number, l: number): number => {
                    let sum = 0;
                    let e = b + l;
                    if (e > len) return undefined;
                    for (let i = b; i < e; i++) {
                        sum += arr2[i].mirate;
                    }
                    return sum / l;
                }
                ni.avg1 = getavg(0, 40);
                ni.avg2 = getavg(40, 40);
                ni.avg3 = getavg(80, 40);
                arr1.unshift(ni);
            }
        }
        this.mirates.push(...(arr1.reverse()));
    }

    async internalStart(param: any) {
        if (param !== undefined) {
            this.trackDay = param.day;
        }
        this.initLoad();
        this.openVPage(VMirateAvg);
    }
}
