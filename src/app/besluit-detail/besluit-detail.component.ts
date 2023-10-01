import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import type { Besluit } from '../odata-tweedekamer/tweedekamer-api.types';
import { DocumentLinkPipe } from './document-link.pipe';

@Component({
  selector: 'app-besluit-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    DocumentLinkPipe,
  ],
  templateUrl: './besluit-detail.component.html',
  styleUrls: ['./besluit-detail.component.scss'],
})
export class BesluitDetailComponent implements OnInit {
  @Input({ required: true }) besluit!: Besluit;

  private orderStemming(): void {
    this.besluit.Stemming?.sort((a, b) => {
      const nameA = (a.ActorNaam ?? 'Z').toUpperCase();
      const nameB = (b.ActorNaam ?? 'Z').toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }

  ngOnInit() {
    this.orderStemming();

    console.log(this.besluit);
  }
}
