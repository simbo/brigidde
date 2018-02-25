import { TerminalCommandHandler } from './../../terminal-command-handler.interface';

export const nowCommand: TerminalCommandHandler = {

  name: 'now',
  description: 'displays the current date and time',

  aliases: [
    'datetime'
  ],

  async run(parseOptions, output) {
    const now = new Date();
    output.next(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
  }

};
