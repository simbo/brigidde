import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { TerminalInputResolver } from './terminal-input/terminal-input-resolver';
import { TerminalMessage } from './terminal-message/terminal-message';
import { TerminalMessageType } from './terminal-message/terminal-message-type.enum';
import { TerminalCommandRunner } from './terminal-commands/terminal-command-runner';
import { TerminalCommandRunnerStatus } from './terminal-commands/terminal-command-runner-status.enum';

@Injectable()
export class TerminalService {

  public readonly inputResolver = new TerminalInputResolver();
  public readonly _runners = new BehaviorSubject(new Set<TerminalCommandRunner>())
  private readonly _messageLog = new BehaviorSubject(new Map<string, TerminalMessage>());

  constructor() {
    this.inputResolver.result.subscribe((input) => this.handleInput(input));
  }

  public get messageLog(): Observable<Map<string, TerminalMessage>> {
    return this._messageLog.asObservable();
  }

  public get runners(): Observable<Set<TerminalCommandRunner>> {
    return this._runners.asObservable();
  }

  public get inputBlocked(): Observable<boolean> {
    return this._runners
      .map((runners) => Array.from(runners.values()))
      .map((runners) => runners.filter((runner) => runner.blocking))
      .map((blockingRunners) => blockingRunners.length > 0)
  }

  private appendToLog(message: TerminalMessage): void {
    const log = this._messageLog.getValue();
    log.set(message.id, message);
    this._messageLog.next(log);
  }

  private handleInput(message: TerminalMessage): void {
    if (!message) return;
    this.appendToLog(message);
    switch(message.type) {
      case TerminalMessageType.Command:
        this.runCommand(message);
        break;
      case TerminalMessageType.Message:
      default:
        break;
    }
  }

  private runCommand(commandMessage: TerminalMessage): void {
    const runner = new TerminalCommandRunner(commandMessage);
    runner.output
      .subscribe((output) => {
        const outputMessage = output instanceof TerminalMessage ?
          output : new TerminalMessage(output as string);
        this.appendToLog(outputMessage);
      });
    runner.status
      .map((status) => {
        switch (status) {
          case TerminalCommandRunnerStatus.Blocking: return 'add';
          case TerminalCommandRunnerStatus.NonBlocking: return null;
          case TerminalCommandRunnerStatus.Stopped: return 'delete';
          default: return false;
        };
      })
      .filter((method) => method !== false)
      .subscribe((method) => {
        const runners = this._runners.getValue();
        if (method) runners[method](runner);
        this._runners.next(runners);
      });
    runner.start();
  }

}
