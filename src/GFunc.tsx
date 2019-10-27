export class GFunc {
  public static numberToFixString(n: number) {
    return n === undefined ? '' : n.toFixed(2);
  }

  public static number100ToFixString(n: number) {
    return n === undefined ? '' : (n * 100).toFixed(2);
  }
}
