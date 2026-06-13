import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { AgendaSupervision } from './agenda-supervision';

describe('AgendaSupervision', () => {
  let component: AgendaSupervision;
  let fixture: ComponentFixture<AgendaSupervision>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockDateS: any;
  let mockAspRoleS: any;
  let mockDialogHandlerS: any;
  let mockRangoCalendarioS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockDateS = {
      getDateFormat: vi.fn(() => '2025-01-01'),
    };
    mockAuthS = {
      applicationUserId: 'user-123',
      infoUserAuth: { firstName: 'John', lastName: 'Doe' },
    };
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockAspRoleS = { hasRole: vi.fn().mockReturnValue(false) };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: '1200px',
    };
    mockRangoCalendarioS = {
      fechaInicioDateFull: new Date(),
      fechaFinalDateFull: new Date(),
      fechaInicial: new Date(),
      fechaFinal: new Date(),
      fechas$: { subscribe: vi.fn() },
    };
    mockTableScrollHeightS = { scrollHeight: '500px' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(AgendaSupervision, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AgendaSupervision],
      providers: [
        { provide: DateService, useValue: mockDateS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: FiltroCalendarService, useValue: mockRangoCalendarioS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AgendaSupervision);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.cb_user()).toEqual([]);
    expect(component.cb_customers()).toEqual([]);
    expect(component.cb_estatus()).toEqual(['Concluido', 'Pendiente']);
  });

  it('onLoadData should call api and set dataSignal', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);
    component.fechaInicial = '2025-01-01';
    component.fechaFinal = '2025-01-31';

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'AgendaSupervision/list/2025-01-01/2025-01-31',
    );
    expect(component.dataSignal()).toEqual(mockData);
  });

  it('onDelete should remove item from dataSignal', async () => {
    await new Promise(resolve => setTimeout(resolve));
    component.dataSignal.set([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ]);

    await component.onDelete('1');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith('AgendaSupervision/1');
    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe('2');
  });

  it('onModalForm should open dialog', async () => {
    const data = { title: 'Test' };
    component.onModalForm(data);
    await new Promise(resolve => setTimeout(resolve));

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });
});
