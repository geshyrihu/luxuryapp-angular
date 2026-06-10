import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PeriodMonthService } from 'src/app/core/services/periodo-month.service';
import { DateService } from 'src/app/core/services/date.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { MinutasResumen } from './minutas-resumen';

describe('MinutasResumen', () => {
  let component: MinutasResumen;
  let fixture: ComponentFixture<MinutasResumen>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockPeriodMonthS: any;
  let mockDateS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn(),
      sizeFull: '100%',
    };
    mockPeriodMonthS = {
      fechaInicial: new Date(2025, 0, 1),
      getPeriodoInicio: new Date(2025, 0, 1),
      getPeriodoFin: new Date(2025, 0, 31),
      setPeriodo: vi.fn(),
    };
    mockDateS = {
      getNameMontYear: vi.fn(() => 'Enero 2025'),
      getDateFormat: vi.fn(() => '2025-01-01'),
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MinutasResumen, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MinutasResumen],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: PeriodMonthService, useValue: mockPeriodMonthS },
        { provide: DateService, useValue: mockDateS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MinutasResumen);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.cb_customers()).toEqual([]);
    expect(component.generalMinutasSignal()).toEqual([]);
    expect(component.generalMinutasGrupoSignal()).toEqual([]);
    expect(component.generalMinutasView()).toBe(false);
    expect(component.generalMinutasGrupoView()).toBe(true);
    expect(component.periodo()).toBe('');
  });

  it('ngOnInit should set periodo and load data', async () => {
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.periodo()).toBe('Enero 2025');
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith('NombreCorto');
    expect(mockApiResponseS.onGetList).toHaveBeenCalledTimes(2);
  });

  it('onLoadData should fetch both general and grupo lists', async () => {
    const mockGeneral = [{ id: 1 }];
    const mockGrupo = [{ id: 2 }];
    mockApiResponseS.onGetList
      .mockResolvedValueOnce(mockGeneral)
      .mockResolvedValueOnce(mockGrupo);

    component.onLoadData('2025-01-01', '2025-01-31');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/ResumenMinutasGeneralLista/2025-01-01/2025-01-31',
    );
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'ResumenGeneral/ResumenMinutasGeneralGrupo/2025-01-01/2025-01-31',
    );
    expect(component.generalMinutasSignal()).toEqual(mockGeneral);
    expect(component.generalMinutasGrupoSignal()).toEqual(mockGrupo);
  });

  it('onFiltrarPeriodo should update period and reload data', () => {
    component.onFiltrarPeriodo('2025-02');
    expect(mockPeriodMonthS.setPeriodo).toHaveBeenCalledWith('2025-02');
  });

  it('onModalFiltroMinutasArea should open dialog', () => {
    component.onModalFiltroMinutasArea(
      'meet-1', 1, 'Pendiente', 0, 'Customer A',
    );
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });
});
