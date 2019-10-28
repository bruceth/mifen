export class GFunc {
  public static numberToFixString(n: number) {
    return n === undefined ? '' : n.toFixed(2);
  }

  public static percentToFixString(n: number) {
    return n === undefined ? '' : (n * 100).toFixed(2) + '%';
  }
}
