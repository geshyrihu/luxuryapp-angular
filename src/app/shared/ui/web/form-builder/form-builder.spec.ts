import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppFormBuilder } from './form-builder';

describe('AppFormBuilder', () => {
  let component: AppFormBuilder;
  let fixture: ComponentFixture<AppFormBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppFormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
