import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { SocketService } from './../../../server/socket/socket.service';
import { ConnectionStatus } from './connection-status.enum';

@Component({
  selector: 'connection-status-text',
  templateUrl: './connection-status-text.component.pug'
})
export class ConnectionStatusTextComponent implements OnInit, OnDestroy {

  private subscriptions: Set<Subscription>;

  private message: BehaviorSubject<string>;
  private messageInterval: number;

  constructor(
    private socketService: SocketService
  ) {
    this.message = new BehaviorSubject<string>('Disconnected');
    this.subscriptions = new Set<Subscription>();
  }

  public ngOnInit(): void {
    this.subscriptions
      .add(this.socketService.onConnect.subscribe(() =>
        this.onStatusUpdate(ConnectionStatus.Connected)
      ))
      .add(this.socketService.onDisconnect.subscribe(() =>
        this.onStatusUpdate(ConnectionStatus.Disconnected)
      ))
      .add(this.socketService.onReconnectFailed.subscribe((attempts) =>
        this.onStatusUpdate(ConnectionStatus.RetryCountdown, attempts)
      ));
  }

  public ngOnDestroy(): void {
    Array.from(this.subscriptions.values())
      .forEach((subscription) => subscription.unsubscribe());
  }

  private onStatusUpdate(
    status: ConnectionStatus,
    attempts?: number
  ) {
    if (this.messageInterval) window.clearInterval(this.messageInterval);
    switch (status) {

      case ConnectionStatus.Connected:
        this.message.next('Connected');
        break;

      case ConnectionStatus.Disconnected:
        this.message.next('Not connected');
        break;

      case ConnectionStatus.RetryCountdown:
        const timeoutDuration = SocketService.getReconnectRetryTimeout(attempts);
        const nextTryTimestamp = timeoutDuration + Date.now();
        const updateRetryMessage = () => {
          const secondsUntilNextTry =
            Math.ceil((nextTryTimestamp - Date.now()) / 1000);
          if (secondsUntilNextTry <= 0) {
            window.clearInterval(this.messageInterval);
            return;
          }
          this.message.next(
            `Connection failed. Retrying in ${
              secondsUntilNextTry
            } second${
              secondsUntilNextTry > 1 ? 's' : ''
            }…`
          );
        };
        updateRetryMessage();
        this.messageInterval = window.setInterval(() => updateRetryMessage(), 200);
        break;

    }
  }

}
