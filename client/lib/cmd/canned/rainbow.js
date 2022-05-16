import { getClient } from '../../client.js';
import { hslToRgb, rgbToHsl, rotate, stringifyColor } from '../../color.js';
import { Second, Millisecond } from '../../duration.js';
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
    const duration = options.speed * Second;
    const client = getClient(options.addr);
    const stepTime = 10 * Millisecond;
    const stepsPerCycle = duration / stepTime;
    const rotationPerLed = (2 * Math.PI) / options.width;
    const rotationPerStep = (2 * Math.PI) / stepsPerCycle;
    const startColor = [ 255, 0, 0 ];

    const animation = {
      StepTime: stepTime,
      Steps: rmap(stepsPerCycle, (iStep) => ({
        Colors: rmap(options.leds, (iLed) => {
          const hsl = rgbToHsl(...startColor);
          const newHsl = rotate(rotate(hsl, rotationPerLed * iLed), rotationPerStep * iStep);
          const color = hslToRgb(...newHsl);

          return stringifyColor(color);
        })
      }))
    };

    console.log(JSON.stringify(animation, null, 2));

    
    await client.cancelAnimation();
    await client.startAnimation(animation);
  }
};

export {
  rainbow
};
