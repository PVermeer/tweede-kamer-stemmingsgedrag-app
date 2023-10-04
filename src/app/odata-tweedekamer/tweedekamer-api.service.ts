import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import buildQuery from 'odata-query';
import { EMPTY, Observable, expand, map, reduce, shareReplay } from 'rxjs';
import {
  Besluit,
  BesluitOptions,
  Data,
  Document,
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

  public getFracties$(options?: FractieOptions): Observable<Data<Fractie[]>> {
    const { year, page } = options ?? {};
    const cacheKey = `${year ?? null} fracties ${page ?? null}`;

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
      orderBy: 'NaamNL asc',
    };

    const query = buildQuery<Fractie>(queryOptions);
    const queryUrl = this.fractieUrl + query;

    obs$ = this.getODataQueryObservable$<Fractie[]>(queryUrl, page);

    this.observablesCache.set(cacheKey, obs$);

    return obs$;
  }

  public getBesluiten$(options?: BesluitOptions): Observable<Data<Besluit[]>> {
    const { year, page, fractieId, onderwerp } = options ?? {};
    const cacheKey = `${year ?? null} besluiten ${fractieId ?? null} ${
      onderwerp ?? null
    } ${page ?? null}`;

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
        ...(fractieId && {
          Stemming: {
            any: {
              Fractie_Id: {
                eq: {
                  type: 'guid',
                  value: fractieId,
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
        Stemming: { orderBy: 'ActorNaam asc' },
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

  public getDocumentUrl(document: Document): string {
    const documentUrl = `${this.documentUrl}/${document.Id}/resource`;
    return documentUrl;
  }

  public getPageSize(): number {
    return this.pageSize;
  }

  private getBaseQueryOptions(page?: number | null): {
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
        count: count ?? null,
        currentPage: page,
        nextPage: null,
        totalPages: null,
      };
    }

    const totalPages = Math.ceil(count / this.pageSize);
    const nextPage = page < totalPages ? page + 1 : null;

    return { data: value, count, currentPage: page, nextPage, totalPages };
  }

  private getODataQueryObservable$<T extends unknown[]>(
    queryUrl: string,
    page?: number | null,
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
