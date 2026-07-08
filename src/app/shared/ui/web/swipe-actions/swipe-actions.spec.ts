import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SwipeActions } from './swipe-actions';

describe('SwipeActions', () => {
  let component: SwipeActions;
  let fixture: ComponentFixture<SwipeActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeActions],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SwipeActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
