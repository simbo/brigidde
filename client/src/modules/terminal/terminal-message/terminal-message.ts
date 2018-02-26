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
  public readonly prompt: string;
  private _parent: TerminalMessage;
  private _body: string = ''
  private _bodyRaw: string = '';

  constructor(body: string | TerminalMessageData) {
    const data: TerminalMessageData = typeof body === 'string' ? { body } : body;
    this.id = data.hasOwnProperty('id') && data.id ? data.id : uuid();
    this.date = data.hasOwnProperty('date') ? new Date(data.date) : new Date();
    this.from = data.hasOwnProperty('from') ? data.from : TerminalMessageSource.System;
    this.type = data.hasOwnProperty('type') ? data.type : TerminalMessageType.Message;
    this.prompt = data.prompt || '';
    this.setParent(data.parent);
    this.setBody(data.body);
  }

  public get parent(): TerminalMessage {
    return this._parent;
  }

  public get body(): string {
    return this._body;
  }

  public get bodyRaw(): string {
    return this._bodyRaw;
  }

  public setParent(parent: TerminalMessage | TerminalMessageData | string | null): void {
    if (!parent) {
      this._parent = null;
      return;
    }
    if (!(parent instanceof TerminalMessage)) {
      console.log(parent);
      parent = new TerminalMessage(parent);
    }
    this._parent = parent as TerminalMessage;
  }

  public setBody(value: string): void {
    if (typeof value !== 'string') return;
    this._bodyRaw = value;
    this._body = this.filterBody(value);
  }

  private filterBody(body: string): string {
    return body
      // reduce leading and trailing whitespace
      .replace(/(^[\s\r\n]+)|([\s\r\n]+$)/g, ' ');
  }

}
