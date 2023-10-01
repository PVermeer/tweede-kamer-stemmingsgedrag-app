import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OdataTweedekamerModule } from 'src/app/odata-tweedekamer/odata-tweedekamer.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, OdataTweedekamerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
