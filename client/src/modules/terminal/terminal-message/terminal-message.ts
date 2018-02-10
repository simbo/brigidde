import * as uuid from 'uuid/v4';
import { Observable } from 'rxjs/Observable';

import { TerminalMessageData } from './terminal-message-data.interface';

export class TerminalMessage {

  public readonly id: string;
  public readonly body: string;
  public readonly date: Date;

  constructor(body: string | TerminalMessageData) {
    const data: TerminalMessageData = typeof body === 'string' ? { body } : body;
    this.id = data.hasOwnProperty('id') ? data.id : uuid();
    this.date = data.hasOwnProperty('date') ? new Date(data.date) : new Date();
    this.body = data.body;
  }

  public getObject(): TerminalMessageData {
    return {
      id: this.id,
      body: this.body,
      date: this.date.toISOString()
    };
  }

}
