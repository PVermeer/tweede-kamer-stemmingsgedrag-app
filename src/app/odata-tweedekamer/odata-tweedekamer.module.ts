import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ODataModule } from 'angular-odata';
import { TweedekamerApiService } from 'src/app/odata-tweedekamer/tweedekamer-api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ODataModule.forRoot({
      config: {
        serviceRootUrl: 'https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/',
      },
    }),
  ],
  providers: [TweedekamerApiService],
})
export class OdataTweedekamerModule {}
