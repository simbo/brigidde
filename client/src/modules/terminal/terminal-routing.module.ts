import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminalComponent } from './terminal.component';

export const routes: Routes = [
  {
    path: 'terminal',
    component: TerminalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalRoutingModule {}
