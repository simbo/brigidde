import { Component, Input, AfterViewInit, OnDestroy} from '@angular/core';

import { MessageBusService } from './../../app/message-bus/message-bus.service';
import { TerminalMessage } from './terminal-message';

@Component({
  selector: 'terminal-message',
  templateUrl: './terminal-message.component.pug',
  styleUrls: ['./terminal-message.component.styl']
})
export class TerminalMessageComponent implements AfterViewInit, OnDestroy {

  @Input() public message: TerminalMessage

  constructor(
    private msgBus: MessageBusService
  ) {}

  public get classNames(): {[name: string]: boolean} {
    return {
    };
  }

  public ngAfterViewInit(): void {
    this.msgBus.push('request:scroll-down:screen');
  }

  public ngOnDestroy(): void {
    this.msgBus.push('request:scroll-down:screen');
  }

}
