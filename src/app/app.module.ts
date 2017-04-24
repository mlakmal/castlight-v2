import { CastLightBootstraper } from './castlight.bootstraper';
import { CastlightUrlSerializer } from './castlight.urlserializer';
import { CastlightComponent } from './castlight.component';
import { NgModule }      from '@angular/core';
import { BrowserModule, DOCUMENT } from '@angular/platform-browser';
import { UrlSerializer } from '@angular/router';

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
    { provide: UrlSerializer, useClass: CastlightUrlSerializer },
    {
      provide: DOCUMENT,
      useValue: document
    }
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
