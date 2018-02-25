import { Opts, ParsedArgs } from 'minimist';

export interface TerminalCommandParseArgs {
  (opts?: Opts | false): ParsedArgs | string;
}
