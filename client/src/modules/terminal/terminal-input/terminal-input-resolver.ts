import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { QueueProcessor } from './../../generic/queue-processor/queue-processor';
import { TerminalMessage } from './../terminal-message/terminal-message';
import { TerminalMessageSource } from './../terminal-message/terminal-message-source.enum';
import { TerminalMessageType } from './../terminal-message/terminal-message-type.enum';
import { TerminalInput } from './terminal-input.interface';

export class TerminalInputResolver {

  private readonly _result = new Subject<TerminalInput>();
  private readonly queueProcessor: QueueProcessor<string, TerminalInput>;

  constructor() {
    this.queueProcessor = new QueueProcessor<string, TerminalInput>(
      async (value) => {
        const body = await this.filterMessageBody(value);
        if (body === '') return null;
        const from = TerminalMessageSource.User;
        const type = await this.resolveMessageType(body);
        const message = new TerminalMessage({ from, type, body });
        return { value, message };
      }
    );
    this.queueProcessor.output.subscribe((result) => {
      if (!result) return;
      this._result.next(result);
    });
    this.queueProcessor.error.subscribe((err) => {
      console.error(err);
    });
  }

  public get result(): Observable<TerminalInput> {
    return this._result.asObservable();
  }

  public commit(input: string): void {
    this.queueProcessor.addItem(input);
  }

  private async filterMessageBody(body: string): Promise<string> {
    return body
      // reduce leading and trailing whitespace
      .replace(/(^[\s\r\n]+)|([\s\r\n]+$)/g, ' ');
  }

  private async resolveMessageType(body: string): Promise<TerminalMessageType> {
    if (body.substr(0, 1) === '/') {
      return TerminalMessageType.Command;
    }
    return TerminalMessageType.Message;
  }

}
