import { Color } from '../color.js';
import { rmap } from '../lists.js';

class Matrix {
  constructor(rows) {
    this.rows = rows;
  }

  set([iRowStart, iRowEnd], [iColStart, iColEnd], values) {
    for (let iRow = iRowStart; iRow < iRowEnd; iRow++) {
      for (let iCol = iColStart; iCol < iColEnd; iCol++) {
        this.steps[iRow][iCol] = values[iRow - iRowStart][iCol - iColStart];
      }
    }
  }

  get([iRowStart, iRowEnd], [iColStart, iColEnd]) {
    return this.rows
      .slice(iRowStart, iRowEnd)
      .map((row) => row.slice(iColStart, iColEnd));
  }

  setAt(iRow, iCol, value) {
    this.rows[iRow][iCol] = value;
  }

  getAt(iRow, iCol) {
    return this.rows[iRow][iCol];
  }
}

class Animation {
  static Builder({ ledCount, duration, resolution }, colorFn) {
    const animation = new Animation(ledCount, duration, resolution);

    animation.steps = rmap(
      animation.stepCount,
      (iStep) =>
        rmap(
          animation.ledCount,
          (iLed) =>
            colorFn(iStep, iLed)
        )
    );

    return animation;
  }

  constructor(ledCount, duration, resolution) {
    this.ledCount = ledCount;
    this.duration = duration;
    this.resolution = resolution;
    this.stepCount = Math.ceil(duration / resolution);
    this.steps = new Matrix(
      rmap(this.stepCount, () => rmap(this.ledCount, () => Color.Black()))
    );
  }

  get serialized() {
    return {
      StepTime: this.resolution,
      Steps: this.steps.map(
        step =>
          ({ Colors: step.map(color => color.hex) })
        )
    };
  }
}

export {
  Matrix,
  Animation
};
