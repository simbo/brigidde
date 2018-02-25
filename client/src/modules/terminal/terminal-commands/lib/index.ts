import { TerminalCommandHandler } from './../terminal-command-handler.interface';

import { commandsCommand } from './commands/commands';
import { nowCommand } from './now/now';
import { echoCommand } from './echo/echo';

export const commands: TerminalCommandHandler[] = [
  commandsCommand,
  echoCommand,
  nowCommand
];

export const commandsByName: {[name: string]: TerminalCommandHandler} = commands
  .reduce((cmds, cmd) => {
    cmds[cmd.name] = cmd;
    if (cmd.aliases) {
      cmd.aliases.forEach((alias) => cmds[alias] = cmd);
    }
    return cmds;
  }, {});
