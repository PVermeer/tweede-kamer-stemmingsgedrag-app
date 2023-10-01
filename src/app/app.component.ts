import { Component } from '@angular/core';
import { TweedekamerApiService } from './odata-tweedekamer/tweedekamer-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tweede-kamer-stemmingsgedrag-app';

  constructor(private tweedeKamerApi: TweedekamerApiService) {}
}
