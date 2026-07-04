import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock("src/app/core/components/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));
vi.mock("heic2any", () => ({ default: vi.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FundingForm } from './funding-form';
import { FaqsFondeo } from './faqs-fondeo';
import { FundingList } from './funding-list';

describe('FundingList', () => {
  let component: FundingList;
  let fixture: ComponentFixture<FundingList>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn(),
    };
    mockCustomerIdS = { customerId: signal('cust-123') };
    mockDialogHandlerS = {
      openDialog: vi.fn(),
      sizeLg: '900px',
    };
    mockRouter = { navigateByUrl: vi.fn(), events: new Subject() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FundingList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(FundingList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on effect trigger via detectChanges', () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'funding/list/cust-123',
    );
  });

  it('onDelete should remove item from dataSignal', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve));
    component.dataSignal.set([
      { id: '1', period: '2024-01' },
      { id: '2', period: '2024-02' },
    ]);
    mockApiResponseS.onDelete.mockResolvedValue(true);

    component.onDelete('1');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe('2');
  });

  it('onDetails should navigate to detail page', () => {
    component.onDetails('fnd-001');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      '/funding/details/fnd-001',
    );
  });

  it('onModalCreate should open FundingForm dialog', () => {
    mockDialogHandlerS.openDialog.mockResolvedValue(true);
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.onModalCreate();
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      FundingForm,
      {},
      'Crear Fondeo',
      '900px',
    );
  });

  it('onModalForm should open FundingForm dialog with data', () => {
    const data = { id: 'fnd-001', title: 'Edit Fondeo' };
    mockDialogHandlerS.openDialog.mockResolvedValue(true);

    component.onModalForm(data);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      FundingForm,
      data,
      'Edit Fondeo',
      '900px',
    );
  });

  it('onFaqsFondeo should open FaqsFondeo dialog', () => {
    component.onFaqsFondeo();
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      FaqsFondeo,
      {},
      '',
      '900px',
    );
  });

  it('isBuscarDisabled should return true when dates are invalid', () => {
    component.fechaInicio = new Date('2024-02-01');
    component.fechaFin = new Date('2024-01-01');
    expect(component.isBuscarDisabled()).toBe(true);
  });

  it('isBuscarDisabled should return false when dates are valid', () => {
    component.fechaInicio = new Date('2024-01-01');
    component.fechaFin = new Date('2024-02-01');
    expect(component.isBuscarDisabled()).toBe(false);
  });
});

