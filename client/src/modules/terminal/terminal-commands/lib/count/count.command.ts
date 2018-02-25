import { ParsedArgs } from 'minimist';

import { numberMinMax } from './../../../../generic/number-min-max';
import { TerminalCommandHandler } from './../../terminal-command-handler.interface';
import { TerminalMessage } from '../../../terminal-message/terminal-message';

export const countCommand: TerminalCommandHandler = {

  name: 'count',
  usage: 'count [--async] <max> [<interval>]',
  description: 'counts to given number',

  async run(parseArgs, output, unblock) {
    const args = parseArgs({
      boolean: [
        'async'
      ],
      alias: {
        a: 'async'
      }
    }) as ParsedArgs;
    const maxValue = numberMinMax(parseInt(args._[0], 10) || 1, 0, 100);
    const async = args.async ? true : false;
    const intervalDuration = numberMinMax(parseInt(args._[1], 10) || 500, 0, 60000);
    const { id } = new TerminalMessage('');
    let interval: number = null;
    let value: number = null;
    await new Promise((resolve, reject) => {
      const intervalFn = () => {
        value = value === null ? 0 : (value + 1);
        const body = `count: ${value}`;
        const message = new TerminalMessage({ id, body });
        output.next(message);
        if (value >= maxValue) {
          clearInterval(interval);
          resolve();
        }
      };
      interval = window.setInterval(intervalFn, intervalDuration);
      intervalFn();
      if (async) unblock();
    });
  }

};
