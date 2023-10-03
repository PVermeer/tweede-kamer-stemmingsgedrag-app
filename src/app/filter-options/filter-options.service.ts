import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BesluitFilter } from './filter-options.types';

@Injectable({
  providedIn: 'root',
})
export class FilterOptionsService {
  private _besluitFilter$ = new Subject<BesluitFilter>();
  public besluitFilter$ = this._besluitFilter$.asObservable();

  public setbesluitFilter(besluitFilter: BesluitFilter): void {
    this._besluitFilter$.next(besluitFilter);
  }
}
