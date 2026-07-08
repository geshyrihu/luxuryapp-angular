import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppLangSelector } from './lang-selector';

describe('AppLangSelector', () => {
  let component: AppLangSelector;
  let fixture: ComponentFixture<AppLangSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLangSelector],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLangSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
