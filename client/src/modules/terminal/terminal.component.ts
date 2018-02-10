import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MessageBusService } from './../app/message-bus/message-bus.service';
import { TokenService } from './../server/token/token.service';
import { SocketService } from './../server/socket/socket.service';
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

  public log: TerminalMessage[];
  public subscriptions: Set<Subscription>;

  constructor(
    public terminalService: TerminalService,
    private msgBus: MessageBusService
  ) {
    this.subscriptions = new Set<Subscription>();
  }

  public onMessageInput(body: string) {
    this.terminalService.input(body);
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.terminalService.messageLog.subscribe((log) => {
        this.log = log;
      })
    );
  }

  public ngOnDestroy(): void {
    Array.from(this.subscriptions)
      .forEach((subscription) => subscription.unsubscribe());
  }

}
