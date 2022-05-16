import { mono } from './canned/mono.js';
import { rainbow } from './canned/rainbow.js';

const canned = {
  name: 'canned',
  description: 'Run a canned animation',
  optionDefinitions: [],

  handle ({ getUsage, ancestors }) {
    console.log(getUsage({
      commandPath: [ ...ancestors, canned.name ]
    }));
  },

  subcommands: {
    rainbow,
    mono,
  }
};

export {
  canned
};
