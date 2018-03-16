import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { TerminalInputResolver } from './terminal-input/terminal-input-resolver';
import { TerminalMessage } from './terminal-message/terminal-message';
import { TerminalMessageType } from './terminal-message/terminal-message-type.enum';
import { TerminalCommandRunner } from './terminal-commands/terminal-command-runner';
import { TerminalCommandRunnerStatus } from './terminal-commands/terminal-command-runner-status.enum';
import { TerminalMessageSource } from './terminal-message/terminal-message-source.enum';

@Injectable()
export class TerminalService {
  public readonly inputResolver = new TerminalInputResolver();
  public readonly _runners = new BehaviorSubject(new Set<TerminalCommandRunner>());
  private readonly _messages = new BehaviorSubject(new Map<string, TerminalMessage>());

  constructor() {
    this.inputResolver.result.subscribe(input => this.handleInput(input));
  }

  public get messages(): Observable<Map<string, TerminalMessage>> {
    return this._messages.asObservable();
  }

  public get messageLog(): Observable<TerminalMessage[]> {
    return (
      this._messages
        .map(messages => Array.from(messages.values()))
        // sort messages by parent relation and timestamp
        .map(messages =>
          messages.sort((a, b) => {
            if (a.parent && b.parent) {
              if (a.parent === b.parent) return a.date.getTime() - b.date.getTime();
              return a.parent.date.getTime() - b.parent.date.getTime();
            }
            if (a.parent) {
              if (a.parent.id === b.id) return 1;
              return a.parent.date.getTime() - b.date.getTime();
            }
            if (b.parent) {
              if (b.parent.id === a.id) return -1;
              return a.date.getTime() - b.parent.date.getTime();
            }
            return a.date.getTime() - b.date.getTime();
          })
        )
    );
  }

  public get inputHistory(): Observable<TerminalMessage[]> {
    return this._messages
      .map(messages => Array.from(messages.values()))
      .map(messages =>
        messages
          .filter(message => message.from === TerminalMessageSource.User)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
      );
  }

  public get runners(): Observable<Set<TerminalCommandRunner>> {
    return this._runners.asObservable();
  }

  public get inputBlocked(): Observable<boolean> {
    return this._runners
      .map(runners => Array.from(runners.values()))
      .map(runners => runners.filter(runner => runner.blocking))
      .map(blockingRunners => blockingRunners.length > 0);
  }

  private appendToLog(message: TerminalMessage): void {
    const log = this._messages.getValue();
    log.set(message.id, message);
    this._messages.next(log);
  }

  private handleInput(message: TerminalMessage): void {
    if (!message) return;
    this.appendToLog(message);
    switch (message.type) {
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
    runner.output.subscribe(output => {
      const outputMessage =
        output instanceof TerminalMessage
          ? output
          : new TerminalMessage(output as string);
      outputMessage.setParent(commandMessage);
      this.appendToLog(outputMessage);
    });
    runner.status
      .map(status => {
        switch (status) {
          case TerminalCommandRunnerStatus.Blocking:
            return 'add';
          case TerminalCommandRunnerStatus.NonBlocking:
            return null;
          case TerminalCommandRunnerStatus.Stopped:
            return 'delete';
          default:
            return false;
        }
      })
      .filter(method => method !== false)
      .subscribe(method => {
        const runners = this._runners.getValue();
        if (method) runners[method](runner);
        this._runners.next(runners);
      });
    runner.start();
  }
}
