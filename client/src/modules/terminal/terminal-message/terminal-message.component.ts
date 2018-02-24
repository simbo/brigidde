import { Component, Input, AfterViewInit, OnDestroy} from '@angular/core';

import { MessageBusService } from './../../app/message-bus/message-bus.service';
import { TerminalMessage } from './terminal-message';
import { TerminalMessageType } from './terminal-message-type.enum';

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
    const classNames = {
      'is-command': this.message.type === TerminalMessageType.Command
    };
    classNames[`from-${this.message.from}`] = true;
    return classNames;
  }

  public ngAfterViewInit(): void {
    this.msgBus.push('request:scroll-down:terminal-screen');
  }

  public ngOnDestroy(): void {
    this.msgBus.push('request:scroll-down:terminal-screen');
  }

}
