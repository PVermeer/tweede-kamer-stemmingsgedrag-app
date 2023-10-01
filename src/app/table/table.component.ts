import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TweedekamerApiService } from '../odata-tweedekamer/tweedekamer-api.service';
import { map, tap } from 'rxjs';
import type { Besluit } from '../odata-tweedekamer/tweedekamer-api.types';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
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
export class TableComponent {
  public besluiten$ = this.tweedekamerApi.getBesluiten$({ page: 1 }).pipe(
    map((besluiten) => besluiten.data),
    tap((x) => console.log(x)),
  );

  public columnsToDisplay = ['date', 'onderwerpen', 'besluitTekst'];
  public expandedElement: Besluit | null = null;

  constructor(private tweedekamerApi: TweedekamerApiService) {}
}
