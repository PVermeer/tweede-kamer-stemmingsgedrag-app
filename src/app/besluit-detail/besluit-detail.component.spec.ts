import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesluitDetailComponent } from './besluit-detail.component';

describe('BesluitDetailComponent', () => {
  let component: BesluitDetailComponent;
  let fixture: ComponentFixture<BesluitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BesluitDetailComponent],
    });
    fixture = TestBed.createComponent(BesluitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
