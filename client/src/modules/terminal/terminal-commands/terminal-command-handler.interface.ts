import { Subject } from 'rxjs/Subject';
import { Opts, ParsedArgs } from 'minimist';

import { TerminalCommandParseArgs } from './terminal-command-parse-args.interface';

export interface TerminalCommandHandler {
  name: string;
  usage?: string;
  description: string;
  aliases?: string[];
  run(
    parseArgs: TerminalCommandParseArgs,
    stdout: Subject<string>,
    unblock: () => void
  ): Promise<void>;
}
