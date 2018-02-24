import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TerminalComponent } from './terminal.component';
import { TerminalInputComponent } from './terminal-input/terminal-input.component';
import { TerminalMessageComponent } from './terminal-message/terminal-message.component';
import { TerminalStatusBarModule } from './terminal-status-bar/terminal-status-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TerminalStatusBarModule
  ],
  declarations: [
    TerminalComponent,
    TerminalInputComponent,
    TerminalMessageComponent
  ],
  exports: [
    TerminalComponent
  ]
})
export class TerminalModule {}
