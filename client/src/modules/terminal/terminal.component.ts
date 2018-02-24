import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TerminalMessage } from './terminal-message/terminal-message';
import { TerminalService } from './terminal.service';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.pug',
  styleUrls: ['./terminal.component.styl'],
  providers: [
    TerminalService
  ]
})
export class TerminalComponent implements OnInit, OnDestroy {

  public messageLog: TerminalMessage[] = [];
  public subscriptions: Subscription[] = [];

  constructor(
    public terminalService: TerminalService
  ) {}

  public onMessageInput(value: string) {
    this.terminalService.inputResolver.commit(value);
  }

  public ngOnInit(): void {
    this.subscriptions
      .push(this.terminalService.messageLog.subscribe((log) => {
        this.messageLog = log;
      }));
  }

  public ngOnDestroy(): void {
    this.subscriptions
      .forEach((subscription) => subscription.unsubscribe());
  }

}
