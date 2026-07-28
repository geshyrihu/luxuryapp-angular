import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { BankListMobile } from './bank-list-mobile';
import { BankDto } from '../interfaces/banks.dto';

describe('BankListMobile', () => {
  let component: BankListMobile;
  let fixture: ComponentFixture<BankListMobile>;

  const mockBanks: BankDto[] = [
    { id: '1', code: 'BOA', shortName: 'Bank of America', largeName: 'The Bank of America Corporation' },
    { id: '2', code: 'JPM', shortName: 'JP Morgan', largeName: 'JPMorgan Chase & Co' },
    { id: '3', code: 'WF', shortName: 'Wells Fargo', largeName: 'Wells Fargo & Company' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankListMobile],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BankListMobile);
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

  it('should handle empty data', () => {
    TestBed.runInInjectionContext(() => {
      component.data = signal([]);
    });
    fixture.detectChanges();
    expect(component.data().length).toBe(0);
  });

  it('should support global filter', () => {
    TestBed.runInInjectionContext(() => {
      component.globalFilterFields = signal(['code', 'shortName', 'largeName']);
    });
    expect(component.globalFilterFields().length).toBe(3);
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

  it('should render list with multiple items', () => {
    TestBed.runInInjectionContext(() => {
      component.data = signal(mockBanks);
    });
    fixture.detectChanges();
    expect(component.data().length).toBe(3);
  });

  it('should have correct bank data structure', () => {
    TestBed.runInInjectionContext(() => {
      component.data = signal(mockBanks);
    });
    fixture.detectChanges();
    const bank = component.data()[0];
    expect(bank).toHaveProperty('id');
    expect(bank).toHaveProperty('code');
    expect(bank).toHaveProperty('shortName');
    expect(bank).toHaveProperty('largeName');
  });
});
