import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Page500 } from './page500';
import { vi } from 'vitest';

describe('Page500', () => {
  let component: Page500;
  let fixture: ComponentFixture<Page500>;

  beforeEach(() => {
    TestBed.overrideComponent(Page500, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Page500],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Page500);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
