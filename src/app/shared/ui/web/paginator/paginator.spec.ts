import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppPaginator } from './paginator';
import { vi } from 'vitest';

describe('AppPaginator', () => {
  let component: AppPaginator;
  let fixture: ComponentFixture<AppPaginator>;

  beforeEach(() => {
    TestBed.overrideComponent(AppPaginator, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AppPaginator],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(AppPaginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle page change', () => {
    const fn = vi.fn();
    component.paginationChange.subscribe(fn);
    fixture.componentRef.setInput('totalRecords', 100);
    component.onPageChange(2);
    expect(component.page()).toBe(2);
    expect(fn).toHaveBeenCalledWith({ page: 2, rows: 20, totalRecords: 100 });
  });
});
