import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, Subscription, debounceTime, take } from 'rxjs';
import { TweedekamerApiService } from '../odata-tweedekamer/tweedekamer-api.service';
import { Fractie } from '../odata-tweedekamer/tweedekamer-api.types';
import { BesluitFilterForm } from './filter-options.types';
import { FilterOptionsService } from './filter-options.service';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss'],
})
export class FilterOptionsComponent implements OnInit, OnDestroy {
  private _subs = new Subscription();

  /** In ms */
  private unserInputDebounceTime = 500;
  private currentYear = new Date().getFullYear();
  public years = new Array(100).fill(null).map((_, i) => {
    return i === 0 ? this.currentYear : this.currentYear - i;
  });

  private _fracties$ = new Subject<Fractie[]>();
  public fracties$ = this._fracties$.asObservable();

  public optionsForm = new FormGroup<BesluitFilterForm>({
    onderwerp: new FormControl(),
    fractieId: new FormControl(),
    page: new FormControl(),
    year: new FormControl(),
  });

  private setFracties(year?: number | null): void {
    this.tweedekamerApi
      .getFracties$({ year })
      .pipe(take(1))
      .subscribe((fracties) => {
        this._fracties$.next(fracties.data);
      });
  }

  constructor(
    private tweedekamerApi: TweedekamerApiService,
    private filterOptions: FilterOptionsService,
  ) {}

  ngOnInit(): void {
    // Set changes to filter service
    this._subs.add(
      this.optionsForm.valueChanges
        .pipe(debounceTime(this.unserInputDebounceTime))
        .subscribe((filterOptions) => {
          this.filterOptions.setbesluitFilter(filterOptions);
        }),
    );

    // Set changes from filter service
    this._subs.add(
      this.filterOptions.besluitFilter$.subscribe((filter) => {
        this.optionsForm.setValue(
          {
            fractieId: filter.fractieId ?? null,
            onderwerp: filter.onderwerp ?? null,
            page: filter.page ?? null,
            year: filter.year ?? null,
          },
          { emitEvent: false },
        );

        // Change fractie list based on year select
        this.setFracties(filter.year);
      }),
    );

    // Set the current paging to not query too much data
    this.optionsForm.controls.page.setValue(1);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
