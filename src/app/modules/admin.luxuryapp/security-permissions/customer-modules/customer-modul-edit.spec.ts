import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CustomerModulEdit } from './customer-modul-edit';

describe('CustomerModulEdit', () => {
  let component: CustomerModulEdit;
  let fixture: ComponentFixture<CustomerModulEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerModulEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerModulEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
