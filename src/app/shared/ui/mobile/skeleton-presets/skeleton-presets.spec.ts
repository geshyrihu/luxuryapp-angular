import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileSkeletonPresets } from './skeleton-presets';

describe('MobileSkeletonPresets', () => {
  let component: MobileSkeletonPresets;
  let fixture: ComponentFixture<MobileSkeletonPresets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSkeletonPresets],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileSkeletonPresets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
