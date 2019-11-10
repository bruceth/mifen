import * as React from 'react';

export class GFunc {
  public static numberToFixString(n: number, w = 2) {
    return n === undefined ? '' : n.toFixed(w);
  }

  public static percentToFixString(n: number) {
    return n === undefined ? '' : (n * 100).toFixed(2) + '%';
  }

  public static warningTypeString(t: string) {
    switch (t) {
      case 'gt': return '大于';
      case 'lt': return '小于';
      default: return t;
    }
  }

  public static caption = (value:string) => <span className="text-muted small">{value}: </span>;
}
