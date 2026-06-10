import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TarjetaProveedor } from './provider-card';

describe('TarjetaProveedor', () => {
  let component: TarjetaProveedor;
  let fixture: ComponentFixture<TarjetaProveedor>;
  let mockApiResponseS: any;
  let mockConfig: any;
  let mockCustomerIdS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
    };
    mockConfig = { data: {} };
    mockCustomerIdS = { customerId: vi.fn(() => 'cust-123') };

    TestBed.overrideComponent(TarjetaProveedor, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TarjetaProveedor],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TarjetaProveedor);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.model).toBeUndefined();
    expect(component.providerId).toBeUndefined();
    expect(component.urlLogo).toBe('');
  });

  it('should load item on init when providerId is provided', async () => {
    const mockResult = { nameProvider: 'Test', pathPhoto: 'photo.jpg' };
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetItem.mockResolvedValue(mockResult);

    fixture = TestBed.createComponent(TarjetaProveedor);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith('Providers/prov-001/cust-123');
    expect(component.model).toEqual(mockResult);
    expect(component.urlLogo).toBe('photo.jpg');
  });

  it('should not call onGetItem when providerId is not provided', () => {
    component.ngOnInit();
    expect(mockApiResponseS.onGetItem).not.toHaveBeenCalled();
  });

  it('should handle null result gracefully', async () => {
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetItem.mockResolvedValue(null);

    fixture = TestBed.createComponent(TarjetaProveedor);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.model).toBeUndefined();
    expect(component.urlLogo).toBe('');
  });

  it('should set urlLogo to empty string when pathPhoto is missing', async () => {
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetItem.mockResolvedValue({ nameProvider: 'Test' });

    fixture = TestBed.createComponent(TarjetaProveedor);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.urlLogo).toBe('');
  });
});
