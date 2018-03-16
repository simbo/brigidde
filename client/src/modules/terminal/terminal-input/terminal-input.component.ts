import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as autosize from 'autosize';
import * as keycode from 'keycode';

import { MessageBusService } from './../../app/message-bus/message-bus.service';
import { TerminalService } from './../terminal.service';
import { TerminalMessage } from './../terminal-message/terminal-message';

@Component({
  selector: 'terminal-input',
  templateUrl: './terminal-input.component.pug',
  styleUrls: ['./terminal-input.component.styl']
})
export class TerminalInputComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() public prompt: string;
  @Output() public message = new EventEmitter<string>();

  public _value: string;
  public textareaElement: HTMLElement;
  public promptElement: HTMLElement;
  public subscriptions: Subscription[] = [];
  public history: string[] = [];
  public historyIndex: number = null;

  constructor(
    public terminalService: TerminalService,
    public msgBus: MessageBusService,
    public elementRef: ElementRef
  ) {}

  public get value(): string {
    return this._value;
  }

  public set value(val: string) {
    this._value = val;
    this.historyStateCheck();
  }

  public get classNames(): { [name: string]: boolean } {
    return {
      'is-command': this.value && this.value.substr(0, 1) === '/'
    };
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.msgBus.channel('request:focus:terminal-input').subscribe(() => this.focus()),
      this.terminalService.inputHistory.subscribe(history =>
        this.onHistoryUpdate(history)
      )
    );
  }

  public ngAfterViewInit(): void {
    this.promptElement = this.elementRef.nativeElement.querySelector(
      '.terminal-input__prompt'
    );
    this.textareaElement = this.elementRef.nativeElement.querySelector(
      '.terminal-input__textarea'
    );
    this.textareaElement.addEventListener('autosize:resized', () =>
      this.msgBus.push('request:scroll-down:terminal-screen')
    );
    autosize(this.textareaElement);
    this.focus();
  }

  public ngAfterViewChecked(): void {
    this.textareaElement.style.textIndent = `${this.promptElement.offsetWidth}px`;
    autosize.update(this.textareaElement);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onClick(event: MouseEvent) {
    event.stopPropagation();
  }

  public onKeyDown(event: KeyboardEvent): void {
    const modKey = event.shiftKey || event.ctrlKey || event.metaKey || event.altKey;
    const key = keycode(event.keyCode);
    switch (key) {
      case 'enter':
        if (modKey) return;
        event.preventDefault();
        this.submitValue();
        return;
      case 'up':
        if (modKey) return;
        event.preventDefault();
        this.historyBack();
        return;
      case 'down':
        if (modKey) return;
        event.preventDefault();
        this.historyForward();
        return;
      case 'tab':
        event.preventDefault();
        return;
      default:
        return;
    }
  }

  public submitValue(): void {
    this.message.emit(this.value);
    this.value = '';
    this.historyReset();
  }

  private focus(): void {
    this.textareaElement.focus();
  }

  private onHistoryUpdate(messages: TerminalMessage[]) {
    let previousMessage: string = null;
    this.history = messages
      .map(message => message.body)
      // remove adjacent duplicates
      .reduce((msgs, message) => {
        if (!previousMessage || previousMessage !== message) {
          msgs.push(message);
        }
        previousMessage = message;
        return msgs;
      }, [])
      .reverse();
  }

  private historyBack(): void {
    if (this.historyIndex === null) {
      this.history.unshift(this.value);
      this.historyIndex = 0;
    }
    this.historyIndex = Math.min(this.history.length - 1, this.historyIndex + 1);
    this.value = this.history[this.historyIndex];
  }

  private historyForward(): void {
    if (!this.historyIndex) return;
    this.historyIndex = Math.max(0, this.historyIndex - 1);
    this.value = this.history[this.historyIndex];
  }

  private historyStateCheck(): void {
    if (this.historyIndex === null) return;
    if (this.value !== this.history[this.historyIndex]) {
      this.historyReset();
    }
  }

  private historyReset(): void {
    if (this.historyIndex !== null) {
      this.historyIndex = null;
      this.history.shift();
    }
  }
}
