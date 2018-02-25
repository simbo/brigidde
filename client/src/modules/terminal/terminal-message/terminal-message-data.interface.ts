import { TerminalMessageSource } from './terminal-message-source.enum';
import { TerminalMessageType } from './terminal-message-type.enum';

export interface TerminalMessageData {
  id?: string;
  date?: string;
  from?: TerminalMessageSource;
  type?: TerminalMessageType;
  body: string;
  bodyRaw?: string;
  prompt?: string;
}
