import { TestBed } from '@angular/core/testing';

import { TweedekamerApiService } from './tweedekamer-api.service';

describe('TweedekamerApiService', () => {
  let service: TweedekamerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweedekamerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
