import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { MyRequestsTask } from './my-requests-task';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { TaskGroupService } from 'src/app/features/tenant/tasks/task.service';
import { ActivatedRoute } from '@angular/router';

describe('MyRequestsTask', () => {
  let component: MyRequestsTask;
  let fixture: ComponentFixture<MyRequestsTask>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockCustomToastS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;
  let mockTaskGroupService: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockCustomToastS = { showSuccess: vi.fn() };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: '1200px',
    };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };
    mockTaskGroupService = { taskGroupMessageStatus: 'NotStarted' };
    mockActivatedRoute = { snapshot: { params: {} } };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MyRequestsTask, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MyRequestsTask],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: CustomToastService, useValue: mockCustomToastS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MyRequestsTask);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.status).toBe('NotStarted');
  });

  it('onLoadData should call api and set signals', async () => {
    const mockData = [{ id: '1', title: 'Request 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData('NotStarted');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
    expect(component.status).toBe('NotStarted');
  });

  it('onUpdatePriority should toggle priority', async () => {
    await new Promise(resolve => setTimeout(resolve));
    component.dataSignal.set([{ id: '1', priority: 'Alta' }]);
    mockApiResponseS.onGetItem.mockResolvedValue(true);

    component.onUpdatePriority('1');
    await new Promise(resolve => setTimeout(resolve));

    expect(component.dataSignal()[0].priority).toBe('Baja');
  });
});

