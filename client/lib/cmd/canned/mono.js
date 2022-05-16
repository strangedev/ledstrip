import { getClient } from '../../client.js';
import { isColorFormat } from '../../color.js';
import { Second } from '../../duration.js';
import { repeated } from '../../lists.js';

const mono = {
  name: 'mono',
  description: 'A single color.',
  optionDefinitions: [
    {
      name: 'color',
      description: 'The color to render.',
      type: 'string',
      alias: 'c',
      defaultValue: '#aa00ff',
      validate (value) {
        if (!isColorFormat(value)) {
          throw new Error('Color must be a 24bit hex, i.e. "#c0ffee".');
        }
      }
    }
  ],

  async handle ({ options }) {
    const client = getClient(options.addr);

    await client.cancelAnimation();
    await client.startAnimation({
      StepTime: 30 * Second,
      Steps: [
        { Colors: repeated(options.color, options.leds) }
      ]
    });
  }
};

export {
  mono
};
