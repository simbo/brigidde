import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { SocketServiceMessage } from './../server/socket/socket-service-message.interface';
import { SocketServiceEventType } from '../server/socket/socket-service-event-type.enum';
import { SocketService } from './../server/socket/socket.service';
import { TerminalMessage } from './terminal-message/terminal-message';

@Injectable()
export class TerminalService {

  private readonly messagesSubject: BehaviorSubject<Map<string, TerminalMessage>>;

  constructor(
    private socketService: SocketService,
  ) {
    this.messagesSubject = new BehaviorSubject<Map<string, TerminalMessage>>(new Map<string, TerminalMessage>());
    this.socketService.onMessageReceived.subscribe((data) => this.onSocketMessageReceived(data));
    this.socketService.onMessageSent.subscribe((data) => this.onSocketMessageSent(data));
  }

  public get messageLog(): Observable<TerminalMessage[]> {
    return this.messagesSubject
      .map((messages) => Array.from(messages.values()))
  }

  public input(body: string): void {
    const message = new TerminalMessage(body);
    this.addMessage(message);
  }

  public onSocketMessageReceived(data: SocketServiceMessage): void {
  }

  public onSocketMessageSent(data: SocketServiceMessage): void {
  }

  private addMessage(message: TerminalMessage): void {
    const messages = this.messagesSubject.getValue();
    messages.set(message.id, message);
    this.messagesSubject.next(messages);
  }


}
