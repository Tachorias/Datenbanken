import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgbComponent } from './agb-component';

describe('AgbComponent', () => {
  let component: AgbComponent;
  let fixture: ComponentFixture<AgbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgbComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
