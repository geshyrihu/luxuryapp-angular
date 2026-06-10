import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { ResultadoGeneralEvaluacionAreasDetalle } from './resultado-general-evaluacion-areas-detalle';

describe('ResultadoGeneralEvaluacionAreasDetalle', () => {
  let component: ResultadoGeneralEvaluacionAreasDetalle;
  let fixture: ComponentFixture<ResultadoGeneralEvaluacionAreasDetalle>;
  let mockApiResponseS: any;
  let mockConfig: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockConfig = {
      data: {
        fecha: '2025-01-01',
        area: 1,
        status: 0,
      },
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ResultadoGeneralEvaluacionAreasDetalle, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ResultadoGeneralEvaluacionAreasDetalle],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ResultadoGeneralEvaluacionAreasDetalle);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it('ngOnInit should call onLoadData with config data', async () => {
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/EvaluacionAreasDetalle/2025-01-01/1/0',
    );
  });

  it('onLoadData should fetch and set dataSignal', async () => {
    const mockData = [{ detalle: 'Test' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData('2025-02-01', 2, 1);
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/EvaluacionAreasDetalle/2025-02-01/2/1',
    );
    expect(component.dataSignal()).toEqual(mockData);
  });
});
