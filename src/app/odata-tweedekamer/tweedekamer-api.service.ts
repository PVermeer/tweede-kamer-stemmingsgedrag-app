import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import buildQuery from 'odata-query';
import { EMPTY, Observable, expand, map, reduce, shareReplay } from 'rxjs';
import {
  Besluit,
  BesluitOptions,
  Data,
  Fractie,
  FractieOptions,
  ODataResponse,
} from './tweedekamer-api.types';

@Injectable({
  providedIn: 'root',
})
export class TweedekamerApiService {
  private baseUrl = 'https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/';
  private besluitUrl = this.baseUrl + 'Besluit';
  private fractieUrl = this.baseUrl + 'Fractie';
  private documentUrl = this.baseUrl + 'Document';
  private pageSize = 25;

  private observablesCache = new Map<string, Observable<unknown>>();

  public getFracties(options?: FractieOptions): Observable<Data<Fractie[]>> {
    const { year, page } = options ?? {};
    const cacheKey = `${year} fracties`;

    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Data<Fractie[]>>
      | undefined;

    if (obs$) {
      return obs$;
    }

    const queryOptions = {
      ...this.getBaseQueryOptions(page),
      filter: {
        ...(year && {
          or: [
            { 'year(DatumInactief)': { eq: null } },
            { 'year(DatumInactief)': { ge: year } },
          ],
        }),
        Verwijderd: { eq: false },
      },
    };

    const query = buildQuery<Fractie>(queryOptions);
    const queryUrl = this.fractieUrl + query;

    obs$ = this.getODataQueryObservable$<Fractie[]>(queryUrl, page);

    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getBesluiten({
    year,
    page,
    fractie,
    onderwerp,
  }: BesluitOptions): Observable<Data<Besluit[]>> {
    const cacheKey = `${year} besluiten ${fractie?.Id} ${onderwerp} ${page}`;

    let obs$ = this.observablesCache.get(cacheKey) as
      | Observable<Data<Besluit[]>>
      | undefined;

    if (obs$) {
      return obs$;
    }

    const queryOptions = {
      ...this.getBaseQueryOptions(page),
      filter: {
        ...(year && { 'year(GewijzigdOp)': { eq: year } }),
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
        ...(onderwerp && {
          Zaak: {
            any: {
              or: [
                { Onderwerp: { contains: onderwerp } },
                { Titel: { contains: onderwerp } },
                { Citeertitel: { contains: onderwerp } },
              ],
            },
          },
        }),
      },
      expand: {
        Stemming: {},
        Zaak: { expand: 'Document' },
      },
      orderBy: 'GewijzigdOp desc',
    };

    const query = buildQuery<Besluit>(queryOptions);
    const queryUrl = this.besluitUrl + query;

    obs$ = this.getODataQueryObservable$<Besluit[]>(queryUrl, page);

    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getFractieLogoUrl(fractie: Fractie): string {
    const logoUrl = `${this.fractieUrl}/${fractie.Id}/resource`;
    return logoUrl;
  }

  public getBesluitDocumentUrls(besluit: Besluit): string[] {
    const documentUrls = (besluit.Zaak ?? [])
      .map((zaak) =>
        (zaak.Document ?? []).map(
          (document) => `${this.documentUrl}/${document.Id}/resource`,
        ),
      )
      .flat();
    return documentUrls;
  }

  private getBaseQueryOptions(page?: number): {
    top?: number;
    skip?: number;
    count: boolean;
  } {
    if (!page) {
      return { count: true };
    }

    const perPage = this.pageSize;
    const top = perPage;
    const skip = perPage * (page - 1);

    return {
      top,
      skip,
      count: true,
    };
  }

  private oDataExpand<T extends ODataResponse>(response: T): Observable<T> {
    return response['@odata.nextLink']
      ? this.http.get<T>(response['@odata.nextLink'])
      : EMPTY;
  }

  private oDataReduce<T extends ODataResponse>(acc: T, response: T): T {
    const { value, ...rest } = response;
    const newAcc = { ...rest, value: [...(acc.value ?? []), ...value] };
    return newAcc as T;
  }

  private oDataMap<T extends ODataResponse>(
    response: T,
    page: number | null = null,
  ): Data<T['value']> {
    const { value, '@odata.count': count } = response;

    if (!count || !page) {
      return {
        data: value,
        currentPage: page,
        nextPage: null,
        totalPages: null,
      };
    }

    const totalPages = Math.ceil(count / this.pageSize);
    const nextPage = page < totalPages ? page + 1 : null;

    return { data: value, currentPage: page, nextPage, totalPages };
  }

  private getODataQueryObservable$<T extends unknown[]>(
    queryUrl: string,
    page?: number,
  ): Observable<Data<T>> {
    return this.http.get<ODataResponse<T>>(queryUrl).pipe(
      expand((response) => this.oDataExpand(response)),
      reduce(this.oDataReduce, {} as ODataResponse<T>),
      map((response) => this.oDataMap(response, page)),
      shareReplay(1),
    );
  }

  constructor(private http: HttpClient) {}
}
