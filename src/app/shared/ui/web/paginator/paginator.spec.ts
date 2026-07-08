import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppPaginator } from './paginator';
import { vi } from 'vitest';

vi.mock('primeng/paginator', () => ({ PaginatorModule: class {} }));

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
    component.pageChange.subscribe(fn);
    component.onPrimePageChange({ first: 20, rows: 10, totalRecords: 100 });
    expect(component.page()).toBe(2);
    expect(fn).toHaveBeenCalledWith({ page: 2, rows: 10, totalRecords: 100 });
  });
});
