import { TerminalCommandHandler } from './../terminal-command-handler.interface';

import { commandsCommand } from './commands/commands.command';
import { nowCommand } from './now/now.command';
import { echoCommand } from './echo/echo.command';

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
