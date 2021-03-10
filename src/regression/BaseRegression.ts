export function maybeToPrecision(value:any, digits:any) {
  if (value < 0) {
    value = 0 - value;
    if (typeof digits === 'number') {
      return `- ${value.toPrecision(digits)}`;
    } else {
      return `- ${value.toString()}`;
    }
  } else {
    if (typeof digits === 'number') {
      return value.toPrecision(digits);
    } else {
      return value.toString();
    }
  }
}

export default class BaseRegression {
  constructor() {
    if (new.target === BaseRegression) {
      throw new Error('BaseRegression must be subclassed');
    }
  }

  predict(x : number | any[]) {
    if (typeof x === 'number') {
      return this._predict(x);
    } else if (Array.isArray(x)) {
      const y = [];
      for (let i = 0; i < x.length; i++) {
        y.push(this._predict(x[i]));
      }
      return y;
    } else {
      throw new TypeError('x must be a number or array');
    }
  }

  _predict(x : number) {
    throw new Error('_predict must be implemented');
  }

  train() {
    // Do nothing for this package
  }

  toString(precision:any) {
    return '';
  }

  toLaTeX(precision:any) {
    return '';
  }

  /**
   * Return the correlation coefficient of determination (r) and chi-square.
   * @param {Array<number>} x
   * @param {Array<number>} y
   * @return {object}
   */
  score(x:any[], y:any[]) {
    if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
      throw new Error('x and y must be arrays of the same length');
    }

    const n = x.length;
    const y2 = new Array(n);
    for (let i = 0; i < n; i++) {
      y2[i] = this._predict(x[i]);
    }

    let xSum = 0;
    let ySum = 0;
    let chi2 = 0;
    let rmsd = 0;
    let xSquared = 0;
    let ySquared = 0;
    let xY = 0;
    for (let i = 0; i < n; i++) {
      xSum += y2[i];
      ySum += y[i];
      xSquared += y2[i] * y2[i];
      ySquared += y[i] * y[i];
      xY += y2[i] * y[i];
      if (y[i] !== 0) {
        chi2 += ((y[i] - y2[i]) * (y[i] - y2[i])) / y[i];
      }
      rmsd += (y[i] - y2[i]) * (y[i] - y2[i]);
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
}