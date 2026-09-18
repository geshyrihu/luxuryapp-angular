import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BankListMobile } from './bank-list-mobile';
import { BankDto } from '../interfaces/banks.dto';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankListMobile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with required input data', () => {
    fixture.componentRef.setInput('data', mockBanks);
    fixture.detectChanges();
    expect(component.data()).toEqual(mockBanks);
  });

  it('should handle empty data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(component.data().length).toBe(0);
  });

  it('should support global filter', () => {
    fixture.componentRef.setInput('globalFilterFields', ['code', 'shortName', 'largeName']);
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
    fixture.componentRef.setInput('data', mockBanks);
    fixture.detectChanges();
    expect(component.data().length).toBe(3);
  });

  it('should have correct bank data structure', () => {
    fixture.componentRef.setInput('data', mockBanks);
    fixture.detectChanges();
    const bank = component.data()[0];
    expect(bank).toHaveProperty('id');
    expect(bank).toHaveProperty('code');
    expect(bank).toHaveProperty('shortName');
    expect(bank).toHaveProperty('largeName');
  });
});
