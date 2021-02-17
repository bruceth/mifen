import * as React from 'react';

export class GFunc {
  public static numberToFixString(n: number, w = 2) {
    return n === undefined ? '' : n.toFixed(w);
  }

  public static numberToMarketValue(n: number) {
    return n === undefined || isNaN(n) ? '' : Math.round(n/10000).toString() + '亿';
  }

  public static numberToString(n: number, precision = 2) {
    return n === undefined ? '' : n.toPrecision(precision);
  }

  public static numberToPrecision(n: number, precision = 4) {
    return n === undefined ? undefined : Number.parseFloat(n.toPrecision(precision));
  }

  public static percentToFixString(n: number) {
    return n === undefined || isNaN(n) ? '' : (n * 100).toFixed(2) + '%';
  }

  public static warningTypeString(t: string) {
    switch (t) {
      case 'gt': return '大于';
      case 'lt': return '小于';
      default: return t;
    }
  }

  public static predictCutRatio(r2:number) {
    return r2 * 2 - r2 * r2;
  }

  public static evaluatePricePrice(iRate:number, e1:number, e2:number, e3:number) {
    let r = 1 + iRate;
    let r2 = r * r;
    let r3 = r2 * r;
    return (e1/r + e2 /r2 + e3 / r3 + e3 / iRate / r3) / 2;
  }

  public static calculateV(z:number, divyield:number, pe:number) {
    if (pe === undefined || isNaN(pe)) {
      return undefined;
    }

    let r = 0;
    if (z !== undefined) {
      if (z > 0.25) {
        z = 0.25;
      }
      r += z * 100;
    }
    if (divyield !== undefined) {
      r += divyield * 100;
    }
    return r / pe;
  }

  public static calculateVN(z:number, e:number, bonus:number, price:number) {
    if (price === undefined || isNaN(price) || e === undefined || isNaN(e)) {
      return undefined;
    }

    let r = 0;
    if (z !== undefined && e > 0) {
      if (z > 0.25) {
        z = 0.24 + Math.pow((z-0.24)*100, 0.6667) / 100;
      }
      z = 1 + z;
      z = z * z * z - 1;
      r += z * e * 100;
    }
    if (bonus !== undefined && !isNaN(bonus)) {
      r += bonus * 100;
    }
    return r / price;
  }

  public static caption = (value:string) => <span className="text-muted small">{value}: </span>;

  public static MonthnoFromDay(day:number) {
    let year = Math.floor(day/10000);
    let month = Math.floor((day%10000)/100) - 1;
    return (year-1995)*12+month;
  }
  
  public static SeasonnoFromDay(day:number) {
    let year = Math.floor(day/10000);
    let month = Math.floor((day%10000)/100) - 1;
    let season = Math.floor(month / 3);
    return (year-1995)*4 + season;
  }
  
  public static SeasonnoFromYearMonth(year:number, month:number) {
    let season = Math.floor((month-1) / 3);
    return (year-1995)*4 + season;
  }

  public static SeasonnoToYearMonth(no: number) {
    let year = Math.floor(no / 4) + 1995;
    let month = (Math.floor(no % 4) + 1) * 3;
    return year * 100 + month;
  }
  
  public static SeasonnoToBeginEnd(season:number) {
    let year = (1995 + Math.floor(season / 4)) * 10000;
    let s = season % 4;
    if (s === 0) {
      return {begin: year + 101, end: year + 331};
    } 
    else if (s === 1) {
      return {begin: year + 401, end: year + 630};
    }
    else if (s === 2) {
      return {begin: year + 701, end: year + 930};
    }
    return {begin: year + 1001, end: year + 1231};
  }

  public static CalculatePredictAvg(arr: {predictpe:number}[]) {
    let ret : {avg20:number, avg50:number, avg100:number} = {avg20:undefined, avg50:undefined, avg100:undefined};

    let length = arr.length;
    let calcuOne = (count:number) : number => {
      let endIndex = count;
      if (endIndex > length)
        endIndex = length;
      if (endIndex >= 10) {
        let sum = 0;
        for (let i = 3; i < endIndex; ++i) {
          sum += arr[i].predictpe
        }
        return sum / (endIndex - 3);
      }
      else {
        return undefined;
      }
    }

    ret.avg20 = calcuOne(20);
    ret.avg50 = calcuOne(50);
    ret.avg100 = calcuOne(100);
    return ret;
  }

  public static CalculateValueAvg(arr: {v:number}[]) {
    let ret : {avg20:number, avg50:number, avg100:number, avg:number} = {avg20:undefined, avg50:undefined, avg100:undefined, avg:undefined};

    let length = arr.length;
    let calcuOne = (count:number) : number => {
      let endIndex = count;
      if (count === 0 || endIndex > length)
        endIndex = length;
      if (endIndex >= 10) {
        let sum = 0;
        for (let i = 3; i < endIndex; ++i) {
          sum += arr[i].v;
        }
        return sum / (endIndex - 3);
      }
      else {
        return undefined;
      }
    }

    ret.avg20 = calcuOne(20);
    ret.avg50 = calcuOne(50);
    ret.avg100 = calcuOne(100);
    ret.avg = calcuOne(0);
    return ret;
  }
}
