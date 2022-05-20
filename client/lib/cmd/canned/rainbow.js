import { Animation } from '../../animation/animation.js';
import { getClient } from '../../client.js';
import { Color } from '../../color.js';
import { Second, Millisecond } from '../../duration.js';

const rainbow = {
  name: 'rainbow',
  description: 'A wave of rainbows.',
  optionDefinitions: [
    {
      name: 'speed',
      description: 'Speed of the animation steps in nanoseconds.',
      type: 'number',
      alias: 's',
      defaultValue: 5
    },
    {
      name: 'width',
      description: 'Width of the rainbow in LEDs.',
      type: 'number',
      alias: 'w',
      defaultValue: 20
    }
  ],

  async handle ({ options }) {
    const ledCount = options.leds;
    const duration = options.speed * Second;
    const client = getClient(options.addr);
    const resolution = 10 * Millisecond;
    const stepsPerCycle = duration / resolution;
    const rotationPerLed = (2 * Math.PI) / options.width;
    const rotationPerStep = (2 * Math.PI) / stepsPerCycle;
    const startColor = new Color({ r: 255, g: 0, b: 0});
    const animation = Animation
      .Builder(
        { ledCount, duration, resolution },
        (iStep, iLed) =>
          startColor
            .clone()
            .rotate(rotationPerLed * iLed)
            .rotate(rotationPerStep * iStep)
      )
      .serialized;
    
    await client.cancelAnimation();
    await client.startAnimation(animation);
  }
};

export {
  rainbow
};
