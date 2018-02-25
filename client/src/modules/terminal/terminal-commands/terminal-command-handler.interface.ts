import { Subject } from 'rxjs/Subject';
import { Opts, ParsedArgs } from 'minimist';

import { TerminalMessage } from './../terminal-message/terminal-message';
import { TerminalCommandParseArgs } from './terminal-command-parse-args.interface';

export interface TerminalCommandHandler {
  name: string;
  usage?: string;
  description: string;
  aliases?: string[];
  run(
    parseArgs: TerminalCommandParseArgs,
    stdout: Subject<string|TerminalMessage>,
    unblock: () => void
  ): Promise<void>;
}
