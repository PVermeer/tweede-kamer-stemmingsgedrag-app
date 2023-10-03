import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppService } from '../app.service';
import { TableComponent } from '../table/table.component';
import { FilterOptionsComponent } from '../filter-options/filter-options.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
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
