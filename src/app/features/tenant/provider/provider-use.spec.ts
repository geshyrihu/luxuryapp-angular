import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { ProviderUse } from './provider-use';

describe('ProviderUse', () => {
  let component: ProviderUse;
  let fixture: ComponentFixture<ProviderUse>;
  let mockApiResponseS: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockConfig = { data: {} };

    TestBed.overrideComponent(ProviderUse, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [ProviderUse],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ProviderUse);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.loading()).toBe(true);
    expect(component.data).toEqual([]);
    expect(component.providerId).toBe('');
  });

  it('should load data on init when providerId is provided', async () => {
    const mockResult = [{ id: '1', description: 'Used in WO-001' }];
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetList.mockResolvedValue(mockResult);

    fixture = TestBed.createComponent(ProviderUse);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('providers/coincidencias/prov-001');
    expect(component.data).toEqual(mockResult);
    expect(component.providerId).toBe('prov-001');
  });

  it('should handle empty result gracefully', async () => {
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetList.mockResolvedValue([]);

    fixture = TestBed.createComponent(ProviderUse);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data).toEqual([]);
  });

  it('should handle null result gracefully', async () => {
    mockConfig.data = { providerId: 'prov-001' };
    mockApiResponseS.onGetList.mockResolvedValue(null);

    fixture = TestBed.createComponent(ProviderUse);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data).toBeNull();
  });

  it('should call onLoadData even when providerId is not provided', async () => {
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('providers/coincidencias/undefined');
  });
});
