import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStyleClass } from './style-class';

describe('AppStyleClass', () => {
  let component: AppStyleClass;
  let fixture: ComponentFixture<AppStyleClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStyleClass],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppStyleClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
