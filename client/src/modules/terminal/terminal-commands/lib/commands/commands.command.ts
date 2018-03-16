import { sortObjectsByProperty } from '../../../../generic/sort-objects-by-property';
import { TerminalCommandHandler } from './../../terminal-command-handler.interface';
import { commands } from './../index';

const commandsListTemplate = require('pug-loader!./commands.pug');

export const commandsCommand: TerminalCommandHandler = {
  name: 'commands',
  description: 'lists all available commands',

  aliases: ['help'],

  async run(parseArgs, stdout) {
    const cmds = commands.slice(0);
    cmds.sort(sortObjectsByProperty('name'));
    const commandsList = commandsListTemplate({ cmds });
    stdout.next(commandsList);
  }
};
