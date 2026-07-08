import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppInputGroup } from './input-group';

describe('AppInputGroup', () => {
  let component: AppInputGroup;
  let fixture: ComponentFixture<AppInputGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppInputGroup],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppInputGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
