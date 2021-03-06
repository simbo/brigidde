import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MessageBusService } from './../../app/message-bus/message-bus.service';

@Component({
  selector: 'terminal-screen',
  templateUrl: './terminal-screen.component.pug',
  styleUrls: ['./terminal-screen.component.styl']
})
export class TerminalScreenComponent implements OnInit, OnDestroy {
  private windowResizeTimeout: number;
  private windowResizeHandler: () => void;
  private subscriptions: Set<Subscription>;
  private contentElement: HTMLElement;

  constructor(private elementRef: ElementRef, private msgBus: MessageBusService) {
    this.windowResizeHandler = () => this.onWindowResize();
    this.subscriptions = new Set<Subscription>();
  }

  public ngOnInit(): void {
    this.contentElement = this.elementRef.nativeElement.firstElementChild;
    window.addEventListener('resize', this.windowResizeHandler);
    this.subscriptions.add(
      this.msgBus
        .channel('request:scroll-down:terminal-screen')
        .subscribe(() => this.scrollDown())
    );
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeHandler);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onClick(event: Event): void {
    this.msgBus.push('request:focus:terminal-input');
  }

  private onWindowResize(): void {
    if (this.windowResizeTimeout) {
      window.clearTimeout(this.windowResizeTimeout);
    }
    this.windowResizeTimeout = window.setTimeout(() => this.scrollDown(), 50);
  }

  private scrollDown(): void {
    const outerElement = this.elementRef.nativeElement;
    const outerElementHeight = outerElement.offsetHeight;
    const innerElementHeight = this.contentElement.offsetHeight;
    const targetPosition = innerElementHeight - outerElementHeight;
    if (outerElement.scrollTop <= targetPosition) {
      outerElement.scrollTop = targetPosition;
    }
  }
}
