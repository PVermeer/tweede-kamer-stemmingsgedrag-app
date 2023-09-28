import { Injectable } from '@angular/core';
import { ODataServiceFactory } from 'angular-odata';
import { Observable, map } from 'rxjs';
import { Besluit, Fractie } from './tweedekamer-api.types';

@Injectable({
  providedIn: 'root',
})
export class TweedekamerApiService {
  private observablesCache = new Map<string, Observable<unknown>>();

  private besluitEntities = this.tweedeKamerApi
    .entitySet<Besluit>('besluit')
    .entities();

  private fractieEntities = this.tweedeKamerApi
    .entitySet<Fractie>('fractie')
    .entities();

  public getFracties(year: number): Observable<Fractie[]> {
    const cacheKey = year + 'fracties';
    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Fractie[]>
      | undefined;
    if (obs$) {
      return obs$;
    }

    obs$ = this.fractieEntities
      .query((q) => {
        q.filter({
          or: [
            { 'year(DatumInactief)': { eq: null } },
            { 'year(DatumInactief)': { ge: year } },
          ],
          Verwijderd: { eq: false },
        });
      })
      .fetchEntities({ withCount: true })
      .pipe(
        map((fracties) => {
          if (!fracties) return [];
          return fracties;
        }),
      );

    this.fractieEntities.clearQuery();
    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getBesluiten(year: number): Observable<Besluit[]> {
    const cacheKey = year + 'besluiten';
    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Besluit[]>
      | undefined;
    if (obs$) {
      return obs$;
    }

    obs$ = this.besluitEntities
      .query((q) => {
        q.filter({
          'year(GewijzigdOp)': { eq: 2023 },
          Verwijderd: { eq: false },
          Status: { eq: 'Besluit' },
          StemmingsSoort: { ne: null },
        });
        q.expand({
          Stemming: {},
          Zaak: { expand: 'Document' },
        });
        q.orderBy('GewijzigdOp asc');
      })
      .fetchEntities({ withCount: true })

      .pipe(
        map((besluiten) => {
          if (!besluiten) {
            return [];
          }
          return besluiten;
        }),
      );

    this.besluitEntities.clearQuery();
    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getFractieLogoUrl(fractie: Fractie) {
    const query = this.fractieEntities.entity(fractie.Id).function('resource');

    return query.endpointUrl();
  }

  constructor(private tweedeKamerApi: ODataServiceFactory) {}
}
