import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { TerminalInputResolver } from './terminal-input/terminal-input-resolver';
import { TerminalMessage } from './terminal-message/terminal-message';

@Injectable()
export class TerminalService {

  public readonly inputResolver = new TerminalInputResolver();
  private readonly _messageLog = new BehaviorSubject<Array<TerminalMessage>>([]);

  constructor() {
    this.inputResolver.result.subscribe((input) => {
      console.log(input);
      if (!input) return;
      this.appendToLog(input.message);
    });
  }

  public get messageLog(): Observable<TerminalMessage[]> {
    return this._messageLog.asObservable();
  }

  private appendToLog(message: TerminalMessage): void {
    const log = this._messageLog.getValue();
    log.push(message);
    this._messageLog.next(log);
  }

}
