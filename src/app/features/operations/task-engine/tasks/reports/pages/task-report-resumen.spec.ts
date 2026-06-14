import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskMessageReportResumen } from './task-report-resumen';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { TaskGroupService } from 'src/app/features/operations/task-engine/tasks/task.service';

describe('TaskMessageReportResumen', () => {
  let component: TaskMessageReportResumen;
  let fixture: ComponentFixture<TaskMessageReportResumen>;
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
    mockTaskGroupService = { taskGroupMessageStatus: 0 };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskMessageReportResumen, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskMessageReportResumen],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskMessageReportResumen);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.status).toBe(0);
    expect(component.data).toBeUndefined();
  });

  it('onLoadData should call api and set data', async () => {
    const mockData = [{ id: '1', title: 'Report' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData('2024-01-01', '2024-01-31');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data).toEqual(mockData);
  });

  it('onDateRangeSelected should format and call onLoadData', () => {
    const spy = vi.spyOn(component, 'onLoadData');
    const event = { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-31') };

    component.onDateRangeSelected(event);

    expect(spy).toHaveBeenCalledWith('2024-01-01T00:00:00.000Z', '2024-01-31T00:00:00.000Z');
  });
});

