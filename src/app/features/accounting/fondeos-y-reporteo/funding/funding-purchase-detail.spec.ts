import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));
vi.mock("heic2any", () => ({ default: vi.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { FundingPurchaseDetail } from './funding-purchase-detail';

describe('FundingPurchaseDetail', () => {
  let component: FundingPurchaseDetail;
  let fixture: ComponentFixture<FundingPurchaseDetail>;
  let mockApiResponseS: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockApiResponseS = { onGetItem: vi.fn() };
    mockConfig = { data: { ordenCompraId: 'oc-123' } };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FundingPurchaseDetail],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(FundingPurchaseDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init when ordenCompraId is set', () => {
    const mockData = { folio: 'FND-001', fechaSolicitud: '2024-01-01' };
    mockApiResponseS.onGetItem.mockResolvedValue(mockData);

    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      'funding/purchase-details/oc-123',
    );
  });

  it('should not call API when ordenCompraId is empty', () => {
    mockConfig.data.ordenCompraId = '';

    fixture = TestBed.createComponent(FundingPurchaseDetail);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).not.toHaveBeenCalled();
  });

  it('should update data signal after API response', async () => {
    const mockData = { folio: 'FND-001', totalGeneral: 1500 };
    mockApiResponseS.onGetItem.mockResolvedValue(mockData);

    component.ngOnInit();
    await vi.waitFor(() => expect(component.data()).toEqual(mockData));
    expect(component.submitting()).toBe(false);
  });

  it('onPrint should call window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    component.onPrint();
    expect(printSpy).toHaveBeenCalled();
  });
});

