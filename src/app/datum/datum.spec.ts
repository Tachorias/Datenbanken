import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datum } from './datum';

describe('Datum', () => {
  let component: Datum;
  let fixture: ComponentFixture<Datum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datum],
    }).compileComponents();

    fixture = TestBed.createComponent(Datum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
