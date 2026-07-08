import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OfflineIndicator } from './offline-indicator';

describe('OfflineIndicator', () => {
  let component: OfflineIndicator;
  let fixture: ComponentFixture<OfflineIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineIndicator],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
