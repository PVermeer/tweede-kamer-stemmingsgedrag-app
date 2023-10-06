import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OdataTweedekamerModule } from 'src/app/odata-tweedekamer/odata-tweedekamer.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { region } from 'functions/src/config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OdataTweedekamerModule,
    LayoutComponent,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFunctions(() => {
      const functions = getFunctions();
      functions.region = region;
      return functions;
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
