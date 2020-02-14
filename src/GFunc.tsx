import * as React from 'react';

export class GFunc {
  public static numberToFixString(n: number, w = 2) {
    return n === undefined ? '' : n.toFixed(w);
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
}
