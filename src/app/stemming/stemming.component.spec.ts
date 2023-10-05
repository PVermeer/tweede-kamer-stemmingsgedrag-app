import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StemmingComponent } from './stemming.component';

describe('StemmingComponent', () => {
  let component: StemmingComponent;
  let fixture: ComponentFixture<StemmingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StemmingComponent],
    });
    fixture = TestBed.createComponent(StemmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
