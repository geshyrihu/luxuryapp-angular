import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AspelCustomerEmpresaList } from './aspel-customer-empresa-list';

describe('AspelCustomerEmpresaList', () => {
  let component: AspelCustomerEmpresaList;
  let fixture: ComponentFixture<AspelCustomerEmpresaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspelCustomerEmpresaList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ModalController, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
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
