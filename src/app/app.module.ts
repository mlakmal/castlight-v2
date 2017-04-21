import { CastLightBootstraper } from './castlight.bootstraper';
import { CastlightComponent } from './castlight.component';
import { NgModule }      from '@angular/core';
import { BrowserModule, DOCUMENT } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule     //Main routes for application
  ],
  declarations: [ AppComponent ],
  providers: [
    CastLightBootstraper,
    {
      provide: DOCUMENT,
      useValue: document
    }
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }