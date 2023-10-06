import { Injectable } from '@angular/core';
import { region } from 'functions/src/config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public title = 'Tweede kamer stemming app';

  public functionsRegion = region;
}
