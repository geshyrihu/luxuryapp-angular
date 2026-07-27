import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { BankListDesktop } from './bank-list-desktop';

describe('BankListDesktop', () => {
  let component: BankListDesktop;
  let fixture: ComponentFixture<BankListDesktop>;

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
