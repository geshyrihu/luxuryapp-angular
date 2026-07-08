import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GlobalErrorAlert } from './global-error-alert';

describe('GlobalErrorAlert', () => {
  let component: GlobalErrorAlert;
  let fixture: ComponentFixture<GlobalErrorAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalErrorAlert],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalErrorAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
