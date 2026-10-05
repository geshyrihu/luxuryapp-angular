import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CustomerModulList } from './customer-modul-list';
import { PlatformService } from '@core/services/platform.service';

describe('CustomerModulList', () => {
  let component: CustomerModulList;
  let fixture: ComponentFixture<CustomerModulList>;

  beforeEach(async () => {
    TestBed.overrideComponent(CustomerModulList, {
      set: { template: '<div></div>', imports: [] },
    });
    await TestBed.configureTestingModule({
      imports: [CustomerModulList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ModalController, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerModulList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
