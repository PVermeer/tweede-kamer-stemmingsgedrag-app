import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TweedekamerApiService } from 'src/app/odata-tweedekamer/tweedekamer-api.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [TweedekamerApiService],
})
export class OdataTweedekamerModule {}
