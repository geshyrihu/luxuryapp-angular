import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskList } from './task-list';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AspRoleService } from 'src/app/core/services/asp-role.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PrintService } from 'src/app/core/services/print.service';
import { TaskGroupService } from 'src/app/features/tenant/tasks/task.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let mockApiS: any;
  let mockAspRoleS: any;
  let mockAuthS: any;
  let mockCustomToastS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockPrintS: any;
  let mockTaskGroupS: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApiS = {
      onGetList: vi.fn().mockResolvedValue({ nameGroup: '', assignee: null, totalRecords: 0, items: [] }),
      onGetListNotLoading: vi.fn().mockResolvedValue({ nameGroup: '', assignee: null, totalRecords: 0, items: [] }),
      onGetItem: vi.fn().mockResolvedValue(true),
      onDelete: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAspRoleS = { roleSignal: vi.fn().mockReturnValue(signal(false)) };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomToastS = { showSuccess: vi.fn() };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: '1200px',
      sizeFull: '100%',
    };
    mockPrintS = { printElement: vi.fn() };
    mockTaskGroupS = {
      taskGroupMessageStatus: 'NotStarted',
      year: 2024,
      numeroSemana: 42,
      setStatus: vi.fn(),
    };
    mockActivatedRoute = { snapshot: { params: { ticketGroupId: 'group-1' } } };
    mockRouter = { navigate: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomToastService, useValue: mockCustomToastS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: PrintService, useValue: mockPrintS },
        { provide: TaskGroupService, useValue: mockTaskGroupS },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal().items).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.status()).toBe('NotStarted');
    expect(component.ticketGroupId).toBe('group-1');
    expect(component.applicationUser).toBe('user-001');
  });

  it('statusLabel should return correct labels', () => {
    expect(component.statusLabel('NotStarted')).toBe('No iniciado');
    expect(component.statusLabel('InProgress')).toBe('En proceso');
    expect(component.statusLabel('Reopened')).toBe('Reabierto');
  });

  it('onLoadData should call api and set signals', async () => {
    const mockResponse = { nameGroup: 'Group', assignee: null, totalRecords: 1, items: [{ id: '1' }] };
    mockApiS.onGetList.mockResolvedValue(mockResponse);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockResponse);
    expect(component.totalRecords()).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('onStatusChange should update status and load data', () => {
    const spy = vi.spyOn(component, 'onLoadData');
    component.onStatusChange('InProgress');
    expect(component.status()).toBe('InProgress');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('onDelete should remove item from data', async () => {
    component.dataSignal.set({ nameGroup: '', assignee: null, totalRecords: 2, items: [{ id: '1' }, { id: '2' }] });
    mockApiS.onDelete.mockResolvedValue(true);

    component.onDelete('1');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal().items.length).toBe(1);
    expect(component.dataSignal().items[0].id).toBe('2');
  });

  it('onUpdatePriority should toggle priority', async () => {
    component.dataSignal.set({ nameGroup: '', assignee: null, totalRecords: 1, items: [{ id: '1', priority: 'High' }] });
    mockApiS.onGetItem.mockResolvedValue(true);

    component.onUpdatePriority('1');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal().items[0].priority).toBe('Low');
  });

  it('printReport should call printService', () => {
    component.printReport();
    expect(mockPrintS.printElement).toHaveBeenCalled();
  });

  it('onPreviewWeeklyReport should navigate', () => {
    component.onPreviewWeeklyReport();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tickets/weekly-report-preview']);
  });
});

