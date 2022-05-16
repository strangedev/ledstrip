import { getClient } from '../../client.js';
import { rotate } from '../../color.js';
import { Millisecond } from '../../duration.js';
import { rmap } from '../../lists.js';

const rainbow = {
  name: 'rainbow',
  description: 'A wave of rainbows.',
  optionDefinitions: [
    {
      name: 'speed',
      description: 'Speed of the animation steps in nanoseconds.',
      type: 'number',
      alias: 's',
      defaultValue: Millisecond
    },
    {
      name: 'width',
      description: 'Width of the rainbow in LEDs.',
      type: 'number',
      alias: 'width',
      defaultValue: 20
    }
  ],

  async handle ({ options }) {
    const client = getClient(options.address);
    const stepTime = Millisecond;
    const stepsPerCycle = options.speed / stepTime;
    const rotationPerLed = (2 * Math.PI) / options.width;
    const rotationPerStep = (2 * Math.PI) / stepsPerCycle;
    const startColor = [ 255, 0, 0 ];

    const animation = {
      StepTime: stepTime,
      Steps: rmap(stepsPerCycle, (iStep) => ({
        Colors: rmap(options.leds, (iLed) => rotate(rotate(startColor, rotationPerLed * iLed), rotationPerStep * iStep))
      }))
    };

    await client.cancelAnimation();
    await client.startAnimation(animation);
  }
};

export {
  rainbow
};
