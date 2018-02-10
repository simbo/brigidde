import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusBarComponent } from './status-bar.component';
import { ConnectionStatusTextComponent } from './connection-status-text/connection-status-text.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StatusBarComponent,
    ConnectionStatusTextComponent
  ],
  exports: [
    StatusBarComponent
  ]
})
export class StatusBarModule {}
