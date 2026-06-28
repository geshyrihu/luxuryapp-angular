import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataViewMobile } from './data-view-mobile';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

const routerEventsSubject = new Subject<any>();

const routerMock = {
  events: routerEventsSubject.asObservable(),
};

const activatedRouteMock = {
  snapshot: { data: { title: 'Test Title' } },
  outlet: 'primary',
  firstChild: null,
} as any;

describe('DataViewMobile', () => {
  let component: DataViewMobile;
  let fixture: ComponentFixture<DataViewMobile>;

  beforeEach(async () => {
    TestBed.overrideComponent(DataViewMobile, {
      set: {
        template: '<div>Mock DataViewMobile</div>',
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [DataViewMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataViewMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty data by default', () => {
    expect(component.data()).toEqual([]);
  });

  it('should have loading false by default', () => {
    expect(component.loading()).toBe(false);
  });

  it('should have showAdd true by default', () => {
    expect(component.showAdd()).toBe(true);
  });

  it('should return index for null item in trackByFn', () => {
    expect(component.trackByFn(5, null)).toBe(5);
  });

  it('should return id property for items with id', () => {
    const item = { id: '123', name: 'test' };
    expect(component.trackByFn(0, item)).toBe('123');
  });

  it('should return index for items without id', () => {
    const item = { name: 'test' };
    expect(component.trackByFn(3, item)).toBe(3);
  });

  it('should filter data based on filterValue', () => {
    const data = [
      { nombre: 'Juan', email: 'juan@test.com' },
      { nombre: 'Pedro', email: 'pedro@test.com' },
    ];
    fixture.componentRef.setInput('data', data);
    fixture.componentRef.setInput('globalFilterFields', ['nombre']);
    fixture.detectChanges();

    component.filterValue.set('Juan');
    fixture.detectChanges();

    expect(component.filteredData().length).toBe(1);
    expect(component.filteredData()[0].nombre).toBe('Juan');
  });

  it('should return all data when filter is empty', () => {
    const data = [{ nombre: 'Juan' }, { nombre: 'Pedro' }];
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();

    expect(component.filteredData().length).toBe(2);
  });

  it('should emit nextPage on infinite scroll', () => {
    const spy = vi.fn();
    component.nextPage.subscribe(spy);
    component.onIonInfinite({});
    expect(spy).toHaveBeenCalledWith({});
  });

  it('should emit add on onAdd', () => {
    const spy = vi.fn();
    component.add.subscribe(spy);
    component.onAdd('test-data');
    expect(spy).toHaveBeenCalledWith('test-data');
  });

  it('should update breadcrumbs on navigation end', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/test', '/test'));
    fixture.detectChanges();
    expect(component.title()).toBe('Test Title');
  });
});
