import { runCli } from 'command-line-interface';
import { canned } from './lib/cmd/canned.js';

const ledstrip = {
  name: 'ledstrip',
  description: 'Send commands to the led strip.',
  optionDefinitions: [
    {
      name: 'addr',
      description: 'The address of the led driver.',
      type: 'string',
      alias: 'a',
    },
    {
      name: 'leds',
      description: 'The number of leds.',
      type: 'number',
      alias: 'n',
    }
  ],

  handle ({ getUsage, ancestors }) {
    console.log(getUsage({
      commandPath: [ ...ancestors, ledstrip.name ]
    }));
  },
  
  subcommands: {
    canned
  }
};

(async () => {
  await runCli({ rootCommand: ledstrip, argv: process.argv });
})();
