import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableCaption } from './table-caption';
import { provideRouter } from '@angular/router';

describe('TableCaption', () => {
  let component: TableCaption;
  let fixture: ComponentFixture<TableCaption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCaption],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCaption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit add event on onAdd', () => {
    const spy = vi.fn();
    component.add.subscribe(spy);
    component.onAdd({ test: true });
    expect(spy).toHaveBeenCalledWith({ test: true });
  });

  it('should emit search and filter table on onSearch', () => {
    const tableMock = { filterGlobal: vi.fn() };
    fixture.componentRef.setInput('dt', tableMock);
    fixture.detectChanges();

    const spy = vi.fn();
    component.search.subscribe(spy);

    component.onSearch('search-term');

    expect(spy).toHaveBeenCalledWith('search-term');
    expect(tableMock.filterGlobal).toHaveBeenCalledWith('search-term', 'contains');
  });

  it('should have default inputs', () => {
    expect(component.showAdd()).toBe(true);
    expect(component.showSearch()).toBe(true);
    expect(component.rolAuth()).toBe(true);
    expect(component.label()).toBe('Agregar');
  });
});
