import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { QueueProcessor } from './../../generic/queue-processor/queue-processor';
import { TerminalMessage } from './../terminal-message/terminal-message';
import { TerminalMessageSource } from './../terminal-message/terminal-message-source.enum';
import { TerminalMessageType } from './../terminal-message/terminal-message-type.enum';
export class TerminalInputResolver {

  private readonly _result = new Subject<TerminalMessage>();
  private readonly queueProcessor: QueueProcessor<string, TerminalMessage>;

  constructor() {
    this.queueProcessor = new QueueProcessor<string, TerminalMessage>(
      async (body) => {
        if (body === '') return null;
        const from = TerminalMessageSource.User;
        const type = await this.resolveMessageType(body);
        const message = new TerminalMessage({ from, type, body });
        return message;
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

  public get result(): Observable<TerminalMessage> {
    return this._result.asObservable();
  }

  public commit(input: string): void {
    this.queueProcessor.addItem(input);
  }

  private async resolveMessageType(body: string): Promise<TerminalMessageType> {
    if (body.substr(0, 1) === '/') {
      return TerminalMessageType.Command;
    }
    return TerminalMessageType.Message;
  }

}
