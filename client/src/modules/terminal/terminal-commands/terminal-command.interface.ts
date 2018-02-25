import { TerminalCommandParseArgs } from './terminal-command-parse-args.interface';
import { TerminalCommandHandler } from './terminal-command-handler.interface';
import { Opts, ParsedArgs } from 'minimist';

export interface TerminalCommand {
  handler: TerminalCommandHandler;
  parseArgs: TerminalCommandParseArgs;
}
