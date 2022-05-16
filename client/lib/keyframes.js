const { default: axios } = require('axios');

const Nanosecond = 1
const Microsecond = Nanosecond * 1e3
const Millisecond = Microsecond * 1e3
const Second = Millisecond * 1e3

const Unset = Symbol('Unset')

const repeated = (item, n) => [...Array(n)].map(_ => item);
const rmap = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));
const lerp = (a, b, amount) => Math.round(a + (b - a) * amount);

class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static Black() {
    return new Color(0, 0, 0);
  }
}

class Step {
  constructor (ledCount) {
    this.ledCount = ledCount;
    this.colors = repeated(Color.Black, ledCount);
  }

  static Colors(colors) {
    const step = new Step(colors.length);
    
    step.colors = colors;

    return step;
  }

  setColors(colors) {
    const step = new Step(this.ledCount);
    
    step.colors = colors;

    return step;
  }
}

class Keyframe {
  constructor(step, time) {
    this.step = step;
    this.time = time;
  }
  align(stepTime) {
    const time = Math.round(this.time / stepTime) * stepTime;

    return new Keyframe(this.step, time);
  }
}

const compareKeyframes = (lhs, rhs) => lhs.time - rhs.time;

const interpolate = (keyfames, stepTime=50 * Millisecond) => {
  const sortedFrames = keyfames.sort(compareKeyframes).map(frame => frame.align(stepTime));

  const steps = [];
  for (let iFrame = 0; iFrame < keyfames.length - 1; iFrame++) {
    const frame = sortedFrames[iFrame];
    const nextFrame = sortedFrames[iFrame + 1];
    const duration = nextFrame.time - frame.time;
    const numSteps = duration / stepTime;

    steps.push(...rmap(numSteps, iStep => {
      return frame.step.setColors(
        frame.step.colors.map(
          (color, iColor) => {
            const nextColor = nextFrame.step.colors[iColor];

            return new Color(
              lerp(color.r, nextColor.r, iStep / numSteps),
              lerp(color.g, nextColor.g, iStep / numSteps),
              lerp(color.b, nextColor.b, iStep / numSteps),
            );
          }
        )
      );
    }));
  }

  return steps;
};

const steps = (keyframeDefs, stepTime) => {
  const keyframes = keyframeDefs.map(
    ([time, colors]) => new Keyframe(
      Step.Colors(
        colors.map(parseColor)
      ),
      time
    )
  );

  return interpolate(keyframes, stepTime);
};

const parseColor = (colorString) => {
  const r = Number.parseInt(colorString.slice(1, 3), 16);
  const g = Number.parseInt(colorString.slice(3, 5), 16);
  const b = Number.parseInt(colorString.slice(5, 7), 16);

  return new Color(r, g, b);
};
const hexbyte = (num) => {
  const hex = num.toString(16);

  return hex.length == 2 ? hex : `0${hex}`;
};
const stringifyColor = (color) => {
  return `#${hexbyte(color.r)}${hexbyte(color.g)}${hexbyte(color.b)}`;
};

const request = (stepTime, keyframeDefs) => ({
  StepTime: stepTime,
  Steps: steps(keyframeDefs, stepTime).map(
    step => ({
      Colors: step.colors.map(stringifyColor)
    })
  )
});

(async () => {
  //await axios.post('http://leddriver.fritz.box:1337/animation/stop');
  await axios.post(
    'http://leddriver.fritz.box:1337/animation/start',
    request(
      50 * Millisecond,
      [
        [0 * Second, [ '#ff0000', '#ff0000', '#ff0000']],
        [1 * Second, [ '#ffff00', '#ffff00', '#ffff00']],
        [2 * Second, [ '#00ff00', '#00ff00', '#00ff00']],
        [3 * Second, [ '#00ffff', '#00ffff', '#00ffff']],
        [4 * Second, [ '#0000ff', '#0000ff', '#0000ff']],
        [5 * Second, [ '#ff00ff', '#ff00ff', '#ff00ff']],
        [6 * Second, [ '#ff0000', '#ff0000', '#ff0000']],
      ]
    ),
  );
})()

