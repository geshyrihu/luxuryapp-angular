import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformService } from '@core/services/platform.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from '@core/services/dialog-handler.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MeterCategoryList } from './meter-category-list';

describe('MeterCategoryList', () => {
  let component: MeterCategoryList;
  let fixture: ComponentFixture<MeterCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeterCategoryList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: ModalController, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: PlatformService, useValue: { isMobile: () => false } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
      ],
    });
    TestBed.overrideComponent(MeterCategoryList, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(MeterCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
