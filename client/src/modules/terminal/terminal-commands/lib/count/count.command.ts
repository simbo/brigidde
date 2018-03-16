import { ParsedArgs } from 'minimist';

import { numberMinMax } from './../../../../generic/number-min-max';
import { TerminalMessage } from './../../../terminal-message/terminal-message';
import { TerminalMessageData } from './../../../terminal-message/terminal-message-data.interface';
import { TerminalCommandHandler } from './../../terminal-command-handler.interface';

export const countCommand: TerminalCommandHandler = {
  name: 'count',
  usage: 'count [--async] [--per-line] <max> [<interval>]',
  description: 'counts to given number',

  async run(parseArgs, output, unblock) {
    const args = parseArgs({
      boolean: ['async', 'per-line'],
      alias: {
        a: 'async',
        p: 'per-line',
        l: 'per-line'
      }
    }) as ParsedArgs;
    const async = args.async ? true : false;
    const perLine = args['per-line'] ? true : false;
    const maxValue = numberMinMax(parseInt(args._[0], 10) || 1, 0, 100);
    const intervalDuration = numberMinMax(parseInt(args._[1], 10) || 500, 0, 60000);
    const baseMessage = new TerminalMessage('');
    let interval: number = null;
    let value: number = null;
    await new Promise((resolve, reject) => {
      const intervalFn = () => {
        value = value === null ? 0 : value + 1;
        const message = perLine ? new TerminalMessage('') : baseMessage;
        message.setBody(`count: ${value}`);
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
