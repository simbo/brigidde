import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { ServerModule } from './../server/server.module';
import { TerminalModule } from './../terminal/terminal.module';
import { MessageBusService } from './message-bus/message-bus.service';
import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ServerModule,
    TerminalModule
  ],
  providers: [
    MessageBusService
  ],
  declarations: [
    AppComponent,
    ScreenComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
