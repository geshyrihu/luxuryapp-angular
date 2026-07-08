import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTagInput } from './tag-input';

describe('AppTagInput', () => {
  let component: AppTagInput;
  let fixture: ComponentFixture<AppTagInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTagInput],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTagInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
