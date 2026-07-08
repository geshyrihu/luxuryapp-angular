import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconTracking } from './button-tracking';

describe('MobileButtonIconTracking', () => {
  let component: MobileButtonIconTracking;
  let fixture: ComponentFixture<MobileButtonIconTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconTracking],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
