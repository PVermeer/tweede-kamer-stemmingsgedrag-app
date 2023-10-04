import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppService } from '../app.service';
import { TableComponent } from '../table/table.component';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    FilterOptionsComponent,
    TableComponent,
  ],
  providers: [],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public appTitle = this.app.title;

  constructor(private app: AppService) {}
}
