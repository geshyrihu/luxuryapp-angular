import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Missing } from './missing';
import { vi } from 'vitest';

describe('Missing', () => {
  let component: Missing;
  let fixture: ComponentFixture<Missing>;

  beforeEach(() => {
    TestBed.overrideComponent(Missing, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Missing],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Missing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
