import { Animation } from '../../animation/animation.js';
import { getClient } from '../../client.js';
import { Color } from '../../color.js';
import { Second } from '../../duration.js';

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
        if (!Color.isColorFormat(value)) {
          throw new Error('Color must be a 24bit hex, i.e. "#c0ffee".');
        }
      }
    }
  ],

  async handle ({ options }) {
    const client = getClient(options.addr);

    await client.cancelAnimation();
    await client.startAnimation(
      Animation
        .Builder(
          {
            ledCount: options.leds,
            duration: Second,
            resolution: Second
          },
          () => Color.fromHex(options.color)
        )
        .serialized
    );
  }
};

export {
  mono
};
