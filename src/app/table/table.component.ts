import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { BesluitDetailComponent } from '../besluit-detail/besluit-detail.component';
import { FilterOptionsService } from '../filter-options/filter-options.service';
import { BesluitFilter } from '../filter-options/filter-options.types';
import { TweedekamerApiService } from '../odata-tweedekamer/tweedekamer-api.service';
import type { Besluit } from '../../../functions/src/tweedekamer-api.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    BesluitDetailComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  private _subs = new Subscription();

  @ViewChild(MatPaginator) private matPaginator!: MatPaginator;

  private _besluiten$ = new Subject<Besluit[]>();
  public besluiten$ = this._besluiten$.asObservable();

  private currentBesluitData?: BesluitFilter;
  public pageSize = this.tweedekamerApi.getPageSize();
  public currentPage: number | null = 1;
  public totalPages: number | null = null;
  public dataLength: number | null = null;

  public columnsToDisplay = ['date', 'onderwerpen', 'besluitTekst'];
  public expandedElement: Besluit | null = null;

  public onPageChange(pageEvent: PageEvent): void {
    const newPage = pageEvent.pageIndex + 1;
    const newBesluitFilter = { ...this.currentBesluitData, page: newPage };
    this.filterOptions.setbesluitFilter(newBesluitFilter);
  }

  constructor(
    private tweedekamerApi: TweedekamerApiService,
    private filterOptions: FilterOptionsService,
  ) {}

  ngOnInit(): void {
    this._subs.add(
      this.filterOptions.besluitFilter$
        .pipe(
          tap((filter) => {
            this.currentBesluitData = filter;
          }),
          switchMap((filter) => this.tweedekamerApi.getBesluiten$(filter)),
        )
        .subscribe((besluitData) => {
          this.currentPage = besluitData.currentPage;
          this.totalPages = besluitData.totalPages;
          this.dataLength = besluitData.count;
          this._besluiten$.next(besluitData.data);
        }),
    );
  }

  ngAfterViewInit() {
    this.matPaginator;
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
