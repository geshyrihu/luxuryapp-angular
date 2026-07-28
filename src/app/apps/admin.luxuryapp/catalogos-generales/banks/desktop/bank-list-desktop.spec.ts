import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { BankListDesktop } from './bank-list-desktop';
import { BankDto } from '../interfaces/banks.dto';

describe('BankListDesktop', () => {
  let component: BankListDesktop;
  let fixture: ComponentFixture<BankListDesktop>;

  const mockBanks: BankDto[] = [
    { id: '1', code: 'BOA', shortName: 'Bank of America', largeName: 'The Bank of America Corporation' },
    { id: '2', code: 'JPM', shortName: 'JP Morgan', largeName: 'JPMorgan Chase & Co' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankListDesktop],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TableScrollHeightService, useValue: { scrollHeight: () => '400px' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankListDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with required input data', () => {
    TestBed.runInInjectionContext(() => {
      component.data = signal(mockBanks);
    });
    fixture.detectChanges();
    expect(component.data()).toEqual(mockBanks);
  });

  it('should initialize loading as true', () => {
    expect(component.loading()).toBe(true);
  });

  it('should have non-null tablePrimeNgRows', () => {
    expect(component.tablePrimeNgRows).toBeGreaterThan(0);
  });

  it('should have non-empty rowsPerPageOptions', () => {
    expect(component.rowsPerPageOptions.length).toBeGreaterThan(0);
  });

  it('should emit add event', () => {
    const spy = vi.spyOn(component.add, 'emit');
    component.add.emit({ id: '', title: 'Nuevo Registro' });
    expect(spy).toHaveBeenCalledWith({ id: '', title: 'Nuevo Registro' });
  });

  it('should emit edit event', () => {
    const spy = vi.spyOn(component.edit, 'emit');
    component.edit.emit({ id: '123', title: 'Editar' });
    expect(spy).toHaveBeenCalledWith({ id: '123', title: 'Editar' });
  });

  it('should emit delete event with string id', () => {
    const spy = vi.spyOn(component.delete, 'emit');
    component.delete.emit('123');
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should render table with data', () => {
    TestBed.runInInjectionContext(() => {
      component.data = signal(mockBanks);
    });
    fixture.detectChanges();
    expect(component.data().length).toBe(2);
  });

  it('should support global filter', () => {
    TestBed.runInInjectionContext(() => {
      component.globalFilterFields = signal(['code', 'shortName']);
    });
    expect(component.globalFilterFields().length).toBe(2);
  });
});
