import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskReportWorkPlanPreview } from './task-report-work-plan-preview';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { TaskGroupService } from 'src/app/features/tasks/task.service';

describe('TaskReportWorkPlanPreview', () => {
  let component: TaskReportWorkPlanPreview;
  let fixture: ComponentFixture<TaskReportWorkPlanPreview>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;
  let mockTaskGroupService: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };
    mockTaskGroupService = {
      setCurrentWeekAndYear: vi.fn(),
      year: 2024,
      numeroSemana: 42,
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReportWorkPlanPreview, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReportWorkPlanPreview],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReportWorkPlanPreview);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toBeNull();
    expect(component.loading()).toBe(true);
  });

  it('setCurrentWeekAndYear should set values from service', () => {
    component.setCurrentWeekAndYear();
    expect(component.year).toBe(2024);
    expect(component.numeroSemana).toBe(42);
    expect(component.weekInputValueControl.value).toBe('2024-W42');
  });

  it('handleWeekChange should parse week value and load data', () => {
    const event = { target: { value: '2024-W43' } } as any;
    component.handleWeekChange(event);
    expect(component.year).toBe(2024);
    expect(component.numeroSemana).toBe(43);
  });

  it('onLoadData should call api and set data', async () => {
    const mockData = [{ id: '1', description: 'Task' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
  });

  it('onSendWorkPlan should call api', () => {
    component.onSendWorkPlan();
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });
});
