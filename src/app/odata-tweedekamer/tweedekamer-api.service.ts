import { Injectable } from '@angular/core';
import { ODataServiceFactory } from 'angular-odata';

interface Activiteit {
  Document: unknown;
  Zaak: unknown;
  Agendapunt: { Besluit: unknown };
}

@Injectable({
  providedIn: 'root',
})
export class TweedekamerApiService {
  public documents = this.tweedeKamerApi
    .entitySet<Activiteit>('activiteit')
    .entities();

  constructor(private tweedeKamerApi: ODataServiceFactory) {
    this.documents
      .query((q) => {
        q.filter({
          Soort: { contains: 'stemming' },
          Verwijderd: { eq: false },
          Status: { eq: 'Uitgevoerd' },
          'year(GewijzigdOp)': { eq: 2023 },
        });
        q.expand({
          Zaak: {},
          Agendapunt: { expand: { Besluit: { expand: 'Stemming' } } },
        });
      })
      .fetchEntities()
      .subscribe((x) => {
        console.log(x);
      });
  }
}
