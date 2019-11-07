export class GFunc {
  public static numberToFixString(n: number) {
    return n === undefined ? '' : n.toFixed(2);
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
}
