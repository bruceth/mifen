export class ErForEarning {
  A:number;
  B:number;
  y: number[];
  r2: number;

  constructor(y:number[]) {
    this.y = y;
    this.regress();
    let score = this.score();
    this.r2 = score.r2;
  }

  regress() {
    const n = this.y.length;
    let xSum = 0;
    let ySum = 0;
  
    let xSquared = 0;
    let xY = 0;
  
    for (let x = 0; x < n; ++x) {
      xSum += x;
      let yx = Math.log(this.y[x]);
      ySum += yx;
      xSquared += x * x;
      xY += x * yx;
    }
  
    const numerator = n * xY - xSum * ySum;
    let slope = numerator / (n * xSquared - xSum * xSum);
    let intercept = (1 / n) * ySum - slope * (1 / n) * xSum;
    this.A = Math.exp(intercept);
    this.B = slope;
  }

  score() {
    const n = this.y.length;
    const y2 = new Array(n);
    for (let i = 0; i < n; i++) {
      y2[i] = this.predict(i);
    }

    let xSum = 0;
    let ySum = 0;
    let chi2 = 0;
    let rmsd = 0;
    let xSquared = 0;
    let ySquared = 0;
    let xY = 0;
    for (let i = 0; i < n; i++) {
      let yi2 = y2[i];
      xSum += yi2;
      let yi = this.y[i];
      ySum += yi;
      xSquared += yi2 * yi2;
      ySquared += yi * yi;
      xY += yi2 * yi;
      let yiyi2 = yi - yi2;
      if (yi !== 0) {
        chi2 += (yiyi2 * yiyi2) / yi;
      }
      rmsd += yiyi2 * yiyi2;
    }

    const r =
      (n * xY - xSum * ySum) /
      Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));

    return {
      r: r,
      r2: r * r,
      chi2: chi2,
      rmsd: Math.sqrt(rmsd / n)
    };
  }

  predict(x:number) {
    return this.A * Math.exp(x * this.B);
  }
}
