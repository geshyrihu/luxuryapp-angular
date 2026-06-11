import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AspelCustomerEmpresaList } from './aspel-customer-empresa-list';

describe('AspelCustomerEmpresaList', () => {
  let component: AspelCustomerEmpresaList;
  let fixture: ComponentFixture<AspelCustomerEmpresaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspelCustomerEmpresaList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AspelCustomerEmpresaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

