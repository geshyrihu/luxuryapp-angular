import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileOfflineIndicator } from './offline-indicator';

describe('MobileOfflineIndicator', () => {
  let component: MobileOfflineIndicator;
  let fixture: ComponentFixture<MobileOfflineIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOfflineIndicator],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileOfflineIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
