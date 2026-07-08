import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileSwipeActions } from './swipe-actions';

describe('MobileSwipeActions', () => {
  let component: MobileSwipeActions;
  let fixture: ComponentFixture<MobileSwipeActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSwipeActions],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileSwipeActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
