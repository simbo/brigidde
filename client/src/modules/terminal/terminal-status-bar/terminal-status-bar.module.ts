import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalStatusBarComponent } from './terminal-status-bar.component';
import { ConnectionStatusTextComponent } from './connection-status-text/connection-status-text.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TerminalStatusBarComponent, ConnectionStatusTextComponent],
  exports: [TerminalStatusBarComponent]
})
export class TerminalStatusBarModule {}
