import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TerminalComponent } from './terminal.component';
import { TerminalRoutingModule } from './terminal-routing.module';
import { TerminalScreenComponent } from './terminal-screen/terminal-screen.component';
import { TerminalMessageComponent } from './terminal-message/terminal-message.component';
import { TerminalInputComponent } from './terminal-input/terminal-input.component';
import { TerminalStatusBarModule } from './terminal-status-bar/terminal-status-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TerminalStatusBarModule,
    TerminalRoutingModule
  ],
  declarations: [
    TerminalComponent,
    TerminalScreenComponent,
    TerminalInputComponent,
    TerminalMessageComponent
  ],
  exports: [
    TerminalComponent
  ]
})
export class TerminalModule {}
