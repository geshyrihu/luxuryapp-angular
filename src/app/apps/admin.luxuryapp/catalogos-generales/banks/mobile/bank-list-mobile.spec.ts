import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BankListMobile } from './bank-list-mobile';

describe('BankListMobile', () => {
  let component: BankListMobile;
  let fixture: ComponentFixture<BankListMobile>;

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

  it('should emit delete event', () => {
    const spy = vi.spyOn(component.delete, 'emit');
    component.delete.emit('123');
    expect(spy).toHaveBeenCalledWith('123');
  });
});
