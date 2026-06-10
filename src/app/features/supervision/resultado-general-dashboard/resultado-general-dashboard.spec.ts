import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodMonthService } from 'src/app/core/services/periodo-month.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { ResultadoGeneralDashboard } from './resultado-general-dashboard';

describe('ResultadoGeneralDashboard', () => {
  let component: ResultadoGeneralDashboard;
  let fixture: ComponentFixture<ResultadoGeneralDashboard>;
  let mockApiResponseS: any;
  let mockDateS: any;
  let mockPeriodMonthS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
    };
    mockDateS = {
      getDateFormat: vi.fn(() => '2025-01-01'),
      getNameMontYear: vi.fn(() => 'Enero 2025'),
    };
    mockPeriodMonthS = {
      fechaInicial: new Date(2025, 0, 1),
      getPeriodoInicio: new Date(2025, 0, 1),
      getPeriodoFin: new Date(2025, 0, 31),
      setPeriodo: vi.fn(),
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ResultadoGeneralDashboard, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ResultadoGeneralDashboard],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DateService, useValue: mockDateS },
        { provide: PeriodMonthService, useValue: mockPeriodMonthS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ResultadoGeneralDashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.reporteFiltro).toBe('MINUTAS GENERAL');
  });

  it('ngOnInit should load customers and minutas', async () => {
    const customers = [{ label: 'Cust A' }, { label: 'Cust B' }];
    mockApiResponseS.onGetSelectItem.mockResolvedValue(customers);

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith('NombreCorto');
    expect(component.cb_customers.length).toBe(2);
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it('onLoadDataMinutas should fetch and set dataSignal', async () => {
    const mockData = [{ minuta: 'Test' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadDataMinutas();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.reporteFiltro).toBe('MINUTAS GENERAL');
    expect(component.dataSignal()).toEqual(mockData);
  });

  it('onLoadDataPreventivos should fetch preventivos', async () => {
    component.onLoadDataPreventivos();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/ReporteResumenPreventivos/2025-01-01/2025-01-01',
    );
  });

  it('onLoadDataTickets should fetch tickets', async () => {
    component.onLoadDataTickets();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/ReporteResumenTicket/2025-01-01/2025-01-01',
    );
  });

  it('onLoadDataMinutaFiltro should fetch filtered minutas', async () => {
    component.onLoadDataMinutaFiltro(3);
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/ReporteResumenMinutasFiltro/2025-01-01/2025-01-01/3/0',
    );
  });

  it('onFiltrarPeriodo should update periodo and reload', () => {
    component.onFiltrarPeriodo('2025-02');
    expect(mockPeriodMonthS.setPeriodo).toHaveBeenCalledWith('2025-02');
    expect(component.periodo).toBe('Enero 2025');
  });

  it('onFiltrarData should update reporteFiltro and reload', () => {
    component.onFiltrarData('TICKETS');
    expect(component.reporteFiltro).toBe('TICKETS');
  });

  it('onValueProgress should return correct colors', () => {
    expect(component.onValueProgress(94)).toBe('#EF4444');
    expect(component.onValueProgress(100)).toBe('#22C55E');
    expect(component.onValueProgress(97)).toBe('#F59E0B');
    expect(component.onValueProgress(95)).toBe('#F59E0B');
    expect(component.onValueProgress(99)).toBe('#F59E0B');
  });
});
