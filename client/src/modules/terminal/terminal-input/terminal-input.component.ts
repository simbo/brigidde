import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as autosize from 'autosize';

import { MessageBusService } from './../../app/message-bus/message-bus.service';

@Component({
  selector: 'terminal-input',
  templateUrl: './terminal-input.component.pug',
  styleUrls: ['./terminal-input.component.styl']
})
export class TerminalInputComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() public prompt: string;
  @Output() public message: EventEmitter<string>;

  public value: string;
  public textareaElement: HTMLElement;
  public promptElement: HTMLElement;
  public subscriptions: Set<Subscription>;

  constructor(
    public msgBus: MessageBusService,
    public elementRef: ElementRef
  ) {
    this.subscriptions = new Set<Subscription>();
    this.message = new EventEmitter<string>();
  }

  public get classNames(): {[name: string]: boolean} {
    return {
      'is-command': this.value && this.value.substr(0, 1) === '/'
    };
  }

  public onClick(event: MouseEvent) {
    event.stopPropagation();
  }

  public onEnterKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    this.submitValue();
  }

  public submitValue(): void {
    this.message.emit(this.value);
    this.value = '';
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.msgBus.channel('request:focus:terminal-input').subscribe(() => this.focus())
    );
  }

  public ngAfterViewInit(): void {
    this.promptElement = this.elementRef.nativeElement.querySelector('.terminal-input__prompt');
    this.textareaElement = this.elementRef.nativeElement.querySelector('.terminal-input__textarea');
    this.textareaElement.addEventListener('autosize:resized',
      () => this.msgBus.push('request:scroll-down:terminal-screen'));
    autosize(this.textareaElement);
    this.focus();
  }

  public ngAfterViewChecked(): void {
    this.textareaElement.style.textIndent = `${this.promptElement.offsetWidth}px`;
    autosize.update(this.textareaElement);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private focus(): void {
    this.textareaElement.focus();
  }

}
