import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TerminalComponent } from './terminal.component';
import { TerminalInputComponent } from './terminal-input/terminal-input.component';
import { TerminalMessageComponent } from './terminal-message/terminal-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
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
