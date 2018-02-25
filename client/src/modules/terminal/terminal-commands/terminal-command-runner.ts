import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as minimist from 'minimist';
import * as stringArgv from 'string-argv';

import { TerminalMessage } from './../terminal-message/terminal-message';
import { TerminalCommandParseArgs } from './terminal-command-parse-args.interface';
import { TerminalCommand } from './terminal-command.interface';
import { TerminalCommandRunnerStatus } from './terminal-command-runner-status.enum';
import { commandsByName } from './lib';

export class TerminalCommandRunner {

  private _blocking: boolean = true;
  private readonly _output = new Subject<string|TerminalMessage>();
  private readonly _status = new BehaviorSubject<TerminalCommandRunnerStatus>(
    TerminalCommandRunnerStatus.Created
  );
  private readonly command: TerminalCommand;

  constructor(
    private readonly message: TerminalMessage
  ) {
    this.command = this.parseCommandMessage();
    if (!this.command) this.stop();
  }

  public get output(): Observable<string|TerminalMessage> {
    return this._output.asObservable();
  }

  public get status(): Observable<TerminalCommandRunnerStatus> {
    return this._status.asObservable();
  }

  public get blocking(): boolean {
    return this._blocking;
  }

  public start(): void {
    if (
      !this.command ||
      this._status.getValue() !== TerminalCommandRunnerStatus.Created
    ) return;
    this._status.next(TerminalCommandRunnerStatus.Blocking);
    this.command.handler
      .run(this.command.parseArgs, this._output, () => this.unblock())
      .then(() => this.stop())
      .catch((err) => {
        this.stop();
        console.error(err);
      });
  }

  private stop(): void {
    if (this._status.getValue() === TerminalCommandRunnerStatus.Stopped) return;
    this._status.next(TerminalCommandRunnerStatus.Stopped);
  }

  private unblock(): void {
    if (this._status.getValue() !== TerminalCommandRunnerStatus.Blocking) return;
    this._blocking = false;
    this._status.next(TerminalCommandRunnerStatus.NonBlocking);
  }

  private parseCommandMessage(): TerminalCommand {
    const match = this.message.body.match(/^\/([a-z-]+)(.*)$/i);
    if (!match) return null;
    const handler = commandsByName[match[1].toLowerCase()];
    if (!handler) return null;
    const parseArgs: TerminalCommandParseArgs = (opts?) => {
      const args = (match[2] || '').replace(/^[\s\r/n]+/, '');
      if (opts === false) return args;
      const argv = stringArgv(match[2]) || [];
      return minimist(argv, opts);
    };
    return { handler, parseArgs };
  }

}
