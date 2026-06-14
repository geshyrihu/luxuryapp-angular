import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { ResultadoGeneralEvaluacionAreas } from './resultado-general-evaluacion-areas';

describe('ResultadoGeneralEvaluacionAreas', () => {
  let component: ResultadoGeneralEvaluacionAreas;
  let fixture: ComponentFixture<ResultadoGeneralEvaluacionAreas>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockDateS: any;
  let mockRangoCalendarioS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn(),
      sizeFull: '100%',
    };
    mockDateS = {
      getDateFormat: vi.fn(() => '2025-01-01'),
    };
    mockRangoCalendarioS = {
      fechaInicial: new Date(2025, 0, 1),
      fechaFinal: new Date(2025, 0, 31),
      fechasMOnth$: { subscribe: vi.fn() },
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ResultadoGeneralEvaluacionAreas, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ResultadoGeneralEvaluacionAreas],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: DateService, useValue: mockDateS },
        { provide: FiltroCalendarService, useValue: mockRangoCalendarioS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ResultadoGeneralEvaluacionAreas);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it('ngOnInit should set fechas and subscribe to fechasMOnth$', () => {
    component.ngOnInit();
    expect(component.fechaInicial).toBe('2025-01-01');
    expect(component.fechaFinal).toBe('2025-01-01');
    expect(mockRangoCalendarioS.fechasMOnth$.subscribe).toHaveBeenCalled();
  });

  it('onLoadData should fetch and set dataSignal', async () => {
    const mockData = [{ area: 'Test' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData('2025-01-01', '2025-01-31');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/EvaluacionAreas/2025-01-01/2025-01-31',
    );
    expect(component.dataSignal()).toEqual(mockData);
  });

  it('onModalFiltroMinutasArea should open dialog', () => {
    component.onModalFiltroMinutasArea('2025-01-01', 1, 0);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });
});
