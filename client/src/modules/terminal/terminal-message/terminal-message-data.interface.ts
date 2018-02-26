import { TerminalMessage } from './terminal-message';
import { TerminalMessageData } from './terminal-message-data.interface';
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
  parent?: TerminalMessage | TerminalMessageData;
}
