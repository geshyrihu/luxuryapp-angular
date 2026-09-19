import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableGlobalFilter } from './table-global-filter';

describe('TableGlobalFilter', () => {
  let component: TableGlobalFilter;
  let fixture: ComponentFixture<TableGlobalFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [TableGlobalFilter],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TableGlobalFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter table on input event', () => {
    const tableMock = { filterGlobal: vi.fn() };
    fixture.componentRef.setInput('dt', tableMock);
    fixture.detectChanges();

    const event = { target: { value: 'test' } } as unknown as Event;
    component.onFilter(event);

    expect(tableMock.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('should not fail when dt is undefined', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    expect(() => component.onFilter(event)).not.toThrow();
  });
});
