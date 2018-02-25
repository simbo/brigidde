import * as uuid from 'uuid/v4';
import { Observable } from 'rxjs/Observable';

import { TerminalMessageData } from './terminal-message-data.interface';
import { TerminalMessageSource } from './terminal-message-source.enum';
import { TerminalMessageType } from './terminal-message-type.enum';

export class TerminalMessage {

  public readonly id: string;
  public readonly date: Date;
  public readonly from: TerminalMessageSource;
  public readonly type: TerminalMessageType
  public readonly body: string;
  public readonly bodyRaw: string;
  public readonly prompt: string;

  constructor(body: string | TerminalMessageData) {
    const data: TerminalMessageData = typeof body === 'string' ? { body } : body;
    if (typeof data.body !== 'string') {
      throw Error(`invalid terminal message body: '${data.body}'`);
    }
    this.id = data.hasOwnProperty('id') ? data.id : uuid();
    this.date = data.hasOwnProperty('date') ? new Date(data.date) : new Date();
    this.from = data.hasOwnProperty('from') ? data.from : TerminalMessageSource.System;
    this.type = data.hasOwnProperty('type') ? data.type : TerminalMessageType.Message;
    this.bodyRaw = data.hasOwnProperty('bodyRaw') ? data.bodyRaw : data.body;
    this.body = data.body
      // reduce leading and trailing whitespace
      .replace(/(^[\s\r\n]+)|([\s\r\n]+$)/g, ' ');
    this.prompt = data.prompt || '';
  }

}
