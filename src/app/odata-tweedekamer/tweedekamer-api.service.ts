import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import buildQuery from 'odata-query';
import { Observable, map } from 'rxjs';
import { Besluit, Fractie, ODataResponse } from './tweedekamer-api.types';

@Injectable({
  providedIn: 'root',
})
export class TweedekamerApiService {
  private baseUrl = 'https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/';
  private besluitUrl = this.baseUrl + 'Besluit';
  private fractieUrl = this.baseUrl + 'Fractie';

  private observablesCache = new Map<string, Observable<unknown>>();

  public getFracties(year: number): Observable<Besluit[]> {
    const cacheKey = year + 'fracties';
    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Besluit[]>
      | undefined;
    if (obs$) {
      return obs$;
    }

    const queryOptions = {
      filter: {
        or: [
          { 'year(DatumInactief)': { eq: null } },
          { 'year(DatumInactief)': { ge: year } },
        ],
        Verwijderd: { eq: false },
      },
    };

    const query = buildQuery<Besluit>(queryOptions);

    obs$ = this.http
      .get<ODataResponse<Besluit[]>>(this.fractieUrl + query)
      .pipe(
        map(({ value: fracties }) => {
          if (!fracties) {
            return [];
          }
          return fracties;
        }),
      );

    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getBesluiten(
    year: number,
    page: number,
    fractie?: Fractie,
  ): Observable<Besluit[]> {
    const cacheKey = year + ' besluiten' + ' page';

    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Besluit[]>
      | undefined;

    if (obs$) {
      return obs$;
    }

    const perPage = 25;
    const top = perPage;
    const skip = perPage * (page - 1);

    const queryOptions = {
      filter: {
        'year(GewijzigdOp)': { eq: 2023 },
        Verwijderd: { eq: false },
        Status: { eq: 'Besluit' },
        StemmingsSoort: { ne: null },
        ...(fractie && {
          Stemming: {
            any: {
              Fractie_Id: {
                eq: {
                  type: 'guid',
                  value: fractie.Id,
                },
              },
            },
          },
        }),
      },
      expand: {
        Stemming: {},
        Zaak: { expand: 'Document' },
      },
      orderBy: 'GewijzigdOp desc',
      top,
      skip,
    };

    const query = buildQuery<Besluit>(queryOptions);

    obs$ = this.http
      .get<ODataResponse<Besluit[]>>(this.besluitUrl + query)
      .pipe(
        map(({ value: besluiten }) => {
          if (!besluiten) {
            return [];
          }
          return besluiten;
        }),
      );

    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getFractieLogoUrl(fractie: Fractie) {
    const logoUrl = `${this.fractieUrl}/${fractie.Id}/resource`;
    return logoUrl;
  }

  constructor(private http: HttpClient) {}
}
