import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTerminal } from './terminal';

describe('AppTerminal', () => {
  let component: AppTerminal;
  let fixture: ComponentFixture<AppTerminal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTerminal],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTerminal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
