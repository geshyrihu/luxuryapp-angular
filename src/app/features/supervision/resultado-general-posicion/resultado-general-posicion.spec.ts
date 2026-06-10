import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { ResultadoGeneralPosicion } from './resultado-general-posicion';

describe('ResultadoGeneralPosicion', () => {
  let component: ResultadoGeneralPosicion;
  let fixture: ComponentFixture<ResultadoGeneralPosicion>;
  let mockApiResponseS: any;
  let mockDateS: any;
  let mockRangoCalendarioS: any;
  let mockTableScrollHeightS: any;
  let fechasSubject: any;

  beforeEach(() => {
    fechasSubject = {
      subscribe: vi.fn(),
      pipe: vi.fn().mockReturnThis(),
    };
    // Create a proper observable-like subject
    fechasSubject.subscribe.mockReturnValue({ unsubscribe: vi.fn() });

    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
    };
    mockDateS = {
      getDateFormat: vi.fn(() => '2025-01-01'),
    };
    mockRangoCalendarioS = {
      fechaInicial: new Date(2025, 0, 1),
      fechaFinal: new Date(2025, 0, 31),
      fechas$: of({
        fechaInicio: '2025-01-01',
        fechaFinal: '2025-01-31',
      }),
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ResultadoGeneralPosicion, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ResultadoGeneralPosicion],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DateService, useValue: mockDateS },
        { provide: FiltroCalendarService, useValue: mockRangoCalendarioS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ResultadoGeneralPosicion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toBeNull();
  });

  it('onLoadData should fetch and set dataSignal', async () => {
    const mockResult = { posicion: 'Test', total: 100 };
    mockApiResponseS.onGetItem.mockResolvedValue(mockResult);

    component.onLoadData('2025-01-01', '2025-01-31');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      'ResumenGeneral/Posicion/2025-01-01/2025-01-31',
    );
    expect(component.dataSignal()).toEqual(mockResult);
  });
});
