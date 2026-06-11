import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskWeeklyReportPreview } from './task-weekly-report-preview';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateRangeStorageService } from 'src/app/features/tenant/tasks/services/date-range-storage.service';
import { TaskGroupService } from 'src/app/features/tenant/tasks/task.service';

describe('TaskWeeklyReportPreview', () => {
  let component: TaskWeeklyReportPreview;
  let fixture: ComponentFixture<TaskWeeklyReportPreview>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDateRangeStorageS: any;
  let mockTaskGroupService: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockDateRangeStorageS = {
      getDateRange: vi.fn().mockReturnValue({ from: null, to: null }),
      saveDateRange: vi.fn(),
    };
    mockTaskGroupService = {
      year: 2024,
      numeroSemana: 42,
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskWeeklyReportPreview, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskWeeklyReportPreview],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DateRangeStorageService, useValue: mockDateRangeStorageS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskWeeklyReportPreview);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.data()).toBeNull();
    expect(component.year).toBe(2024);
    expect(component.numeroSemana).toBe(42);
  });

  it('onLoadData should call api and set data signal', async () => {
    const mockData = [{ id: '1', title: 'Weekly Report' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data()).toEqual(mockData);
  });
});

