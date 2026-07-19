import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentGridComponent } from './comment-grid-component';

describe('CommentGridComponent', () => {
  let component: CommentGridComponent;
  let fixture: ComponentFixture<CommentGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentGridComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
