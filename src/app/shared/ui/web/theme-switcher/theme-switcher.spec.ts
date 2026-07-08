import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppThemeSwitcher } from './theme-switcher';

describe('AppThemeSwitcher', () => {
  let component: AppThemeSwitcher;
  let fixture: ComponentFixture<AppThemeSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppThemeSwitcher],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppThemeSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
