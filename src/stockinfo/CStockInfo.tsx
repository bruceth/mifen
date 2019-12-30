/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { observable, IObservableArray, computed } from 'mobx';
import { nav } from 'tonva';
import { CUqBase } from '../CUqBase';
import { CMiApp } from '../CMiApp';
import { GFunc } from '../GFunc';
import { VStockInfo } from './VStockInfo'
import { NStockInfo, StockPrice, StockEarning, StockRoe, StockCapitalearning, StockBonus, StockDivideInfo } from './StockInfoType';
import { VTags, VNewTag, VEditTag } from './VTags';
import { ErForEarning, SlrForEarning } from 'regression';

export class CStockInfo extends CUqBase {
  baseItem: NStockInfo;
  @observable protected loaded: boolean = false;

  @observable price: StockPrice;
  @observable roe: StockRoe;
  //@observable tags: any[] = undefined;
  @observable stockTags: any[];
  selectedTags: any[];

  protected exrightForEarning: {day:number, factor:number}[] = [];
  @observable seasonData:{season:number, c:number, e:number, esum:number, corg:number, eorg:number, esumorg:number}[] = [];
  @observable predictSeasonData:{season:number, c:number, e:number, esum:number, corg:number, eorg:number, esumorg:number}[] = [];
  @observable predictData: { e:number, b: number, r2: number, epre:number, l:number, lr2:number, lpre:number};

  protected _earning: IObservableArray<StockEarning> = observable.array<StockEarning>([], { deep: true });
  protected _capitalearning: IObservableArray<StockCapitalearning> = observable.array<StockCapitalearning>([], { deep: true });
  protected _bonus: IObservableArray<StockBonus> = observable.array<StockBonus>([], { deep: true });
  protected _divideInfo: IObservableArray<StockDivideInfo> = observable.array<StockDivideInfo>([], { deep: true });

  @computed get earning(): IObservableArray<StockEarning> {
    if (this.loaded === false) return undefined;
    return this._earning;
  }

  @computed get capitalearning(): IObservableArray<StockCapitalearning> {
    if (this.loaded === false) return undefined;
    return this._capitalearning;
  }

  @computed get bonus(): IObservableArray<StockBonus> {
    if (this.loaded === false) return undefined;
    return this._bonus;
  }

  @computed get divideInfo(): IObservableArray<StockDivideInfo> {
    if (this.loaded === false) return undefined;
    return this._divideInfo;
  }

  loadData = () => {
    this.loading();
  }

  loading = async () => {
    if (!this.baseItem)
      return;
    let { id } = this.baseItem;
    let rets = await Promise.all([
      this.cApp.miApi.query('q_stockallinfo', [id]),
      this.cApp.miApi.query('t_tagstock$query', [this.user.id, undefined, id]) //this.uqs.mi.TagStock.query({ user: nav.user.id, stock: id })
    ]);
    this.stockTags = rets[1];
    let ret = rets[0];
    if (Array.isArray(ret[0])) {
      let arr1 = ret[1];
      if (Array.isArray(arr1)) {
        this.price = arr1[0];
      }

      let arr2 = ret[2];
      if (Array.isArray(arr2)) {
        this.roe = arr2[0];
      }

      if (this._earning.length > 0) {
        this._earning.clear();
      }
      let arr3 = ret[3];
      if (Array.isArray(arr3)) {
        this._earning.push(...arr3);
      }

      if (this._capitalearning.length > 0) {
        this._capitalearning.clear();
      }
      let arr4 = ret[4];
      if (Array.isArray(arr4)) {
        this._capitalearning.push(...arr4);
      }

      if (this._bonus.length > 0) {
        this._bonus.clear();
      }
      let arr5 = ret[5];
      if (Array.isArray(arr5)) {
        this._bonus.push(...arr5);
      }

      if (this._divideInfo.length > 0) {
        this._divideInfo.clear();
      }
      let arr6 = ret[6];
      if (Array.isArray(arr6)) {
        this._divideInfo.push(...arr6);
      }

      this.exrightForEarning = ret[7];
      let arr8 = ret[8];
      await this.loadTTMEarning(arr8);
    }

    this.loaded = true;
  }

  protected async loadTTMEarning(list: {seasonno:number, capital:number, earning:number, es:number}[]) {
    this.seasonData.splice(0);
    let seasonlist: {[index:number]:{season:number, c:number, e:number, esum:number, corg:number, eorg:number, esumorg:number}} = {};
    let len = list.length;
    if (len <= 0)
      return;
    let minNo = list[len - 1].seasonno;
    let maxNo = list[0].seasonno;
    let {end} = GFunc.SeasonnoToBeginEnd(maxNo);
    for (let item of list) {
      let no = item.seasonno;
      let sItem = {season:no, c: item.capital, e: item.es, esum: item.earning, corg: item.capital, eorg: item.es, esumorg: item.earning}
      this.ExrightEarning(end, no, sItem);
      seasonlist[no] = sItem;
    }

    let i = 0;
    let esum = 0;
    for (let seasonno = minNo; seasonno <= maxNo; ++seasonno, ++i) {
      let si = seasonlist[seasonno];
      if (si === undefined) {
        continue;
      }
      esum += si.e;
      if (i < 3) {
        si.esum = undefined;
      }
      else {
        si.esum = esum;
        let pastitem = seasonlist[seasonno-3];
        if (pastitem !== undefined) {
          esum -= pastitem.e;
        }
      }
      this.seasonData.splice(0,0, si);
    }

    let noBegin = maxNo - 19;
    this.predictData = undefined;
    this.predictSeasonData.splice(0);
    if (noBegin < minNo)
      return;
    noBegin += 3;
    let y:number[] = [];
    for (let x = noBegin; x <= maxNo; x += 4) {
      let item = seasonlist[x];
      this.predictSeasonData.splice(0, 0, item);
      if (item === undefined)
        break;
      y.push(item.esum);
    }
    if (y.length === 5) {
      let er = new ErForEarning(y);
      let lr = new SlrForEarning(y);
      this.predictData = {e:y[4], b: er.B, r2: er.r2, epre: er.predict(4), l: lr.slopeR, lr2: lr.r2, lpre: lr.predict(4)};
    }
    else {
      this.predictSeasonData.splice(0);
    }
  }

  protected ExrightEarning(endDay:number, season:number, item:{c:number, e:number, esum:number}) {
    let {end} = GFunc.SeasonnoToBeginEnd(season);
    for (let i = 0; i < this.exrightForEarning.length; ++i) {
      let exitem = this.exrightForEarning[i];
      let day = exitem.day;
      if (day > endDay)
        break;
      else if (day < end)
        continue;
      else {
        let factor = exitem.factor;
        item.c = item.c * factor;
        item.e = item.e * factor;
        item.esum = item.esum * factor;
      }
    }
  }


  async internalStart(param: any) {
    this.baseItem = param as NStockInfo;
    this.loadData();
    this.openVPage(VStockInfo);
  }

  openMetaView = () => {
  }

  onSelectTag = async () => {
    //await this.loadTags();
    this.selectedTags = this.cApp.tags.filter(v => {
      let i = this.stockTags.findIndex(st => st.tag === v.id);
      return i >= 0;
    });
    //await this.loadTags();
    this.openVPage(VTags);
  }

  onNewTag = () => {
    this.openVPage(VNewTag);
  }

  onEditTag = (param: any) => {
    this.openVPage(VEditTag, param);
  }

  onSaveNewTag = async (data: any) => {
    let { name } = data;
    //let param = { id: undefined, name: name };
    let ret = await this.cApp.miApi.call('t_tag$save', [this.user.id, undefined, name]);
    let { retId } = ret;
    if (retId < 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    this.cApp.tags.push({ id: retId, name: name });
    return true;
  }

  onSaveTag = async (data: any) => {
    let { id, name } = data;
    let param = { id: id, name: name };
    let i = this.cApp.tags.findIndex(v => v.id !== id && v.name === name);
    if (i >= 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    let ret = await this.cApp.miApi.call('t_tag$save', [this.user.id, undefined, name]);
    let { retId } = ret;
    if (retId === undefined || retId < 0) {
      alert(name + ' 已经被使用了');
      return false;
    }
    i = this.cApp.tags.findIndex(v => v.id === id);
    if (i >= 0) {
      this.cApp.tags[i].name = name;
    }
    return true;
  }

  onClickSelectTag = async (tag: any, isSelected: boolean) => {
    let param = {
      user: nav.user.id,
      tag: tag.id,
      arr1: [
        { stock: this.baseItem.id }
      ]
    };
    if (isSelected === true) {
      let ret = await this.cApp.miApi.call('t_tagstock$add', [this.user.id, tag.id, this.baseItem.id]); //.uqs.mi.TagStock.add(param);
      let newTag = {
        tag: {
          id: tag.id,
        }
      }
      this.stockTags.push(newTag);
      await this.cApp.AddTagStockID(tag.id, this.baseItem.id);
    }
    else {
      let ret = await this.cApp.miApi.call('t_tagstock$del', [this.user.id, tag.id, this.baseItem.id]); // //await this.uqs.mi.TagStock.del(param);
      let i = this.stockTags.findIndex(v => v.tag.id === tag.id);
      this.stockTags.splice(i, 1);
      await this.cApp.RemoveTagStockID(tag.id, this.baseItem.id);
    }
  }
}
