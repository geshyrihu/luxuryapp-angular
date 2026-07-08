import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppPrintView } from './print-view';

describe('AppPrintView', () => {
  let component: AppPrintView;
  let fixture: ComponentFixture<AppPrintView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPrintView],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppPrintView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
