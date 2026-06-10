import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeNgCustomGlobalFilter } from './primeng-custom-global-filter';

describe('PrimeNgCustomGlobalFilter', () => {
  let component: PrimeNgCustomGlobalFilter;
  let fixture: ComponentFixture<PrimeNgCustomGlobalFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeNgCustomGlobalFilter],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimeNgCustomGlobalFilter);
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
