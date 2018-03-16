import { escapeHtml } from './../../../../generic/escape-html';
import { TerminalCommandHandler } from './../../terminal-command-handler.interface';

export const echoCommand: TerminalCommandHandler = {
  name: 'echo',
  usage: 'echo <string>',
  description: 'output given string',

  async run(parseArgs, output) {
    const text = parseArgs(false) as string;
    output.next(escapeHtml(text));
  }
};
