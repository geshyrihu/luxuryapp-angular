import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Page404 } from './page404';
import { vi } from 'vitest';

describe('Page404', () => {
  let component: Page404;
  let fixture: ComponentFixture<Page404>;

  beforeEach(() => {
    TestBed.overrideComponent(Page404, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Page404],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Page404);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
