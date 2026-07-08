import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileEmptyState } from './empty-state';

describe('MobileEmptyState', () => {
  let component: MobileEmptyState;
  let fixture: ComponentFixture<MobileEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileEmptyState],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
