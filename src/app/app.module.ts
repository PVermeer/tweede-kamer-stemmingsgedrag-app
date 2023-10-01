import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OdataTweedekamerModule } from 'src/app/odata-tweedekamer/odata-tweedekamer.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OdataTweedekamerModule,
    LayoutComponent,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
