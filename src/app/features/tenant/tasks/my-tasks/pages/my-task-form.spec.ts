import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { MyTaskForm } from './my-task-form';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskGroupService } from 'src/app/features/tenant/tasks/task.service';
import { of } from 'rxjs';

describe('MyTaskForm', () => {
  let component: MyTaskForm;
  let fixture: ComponentFixture<MyTaskForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockEnumSelectS: any;
  let mockConfig: any;
  let mockRef: any;
  let mockTaskGroupService: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([{ value: 'g1', label: 'Group 1' }]),
      onGetItem: vi.fn().mockResolvedValue({ title: 'Test', description: 'Desc' }),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockEnumSelectS = { priorityLevel: vi.fn().mockReturnValue(of([{ value: 1, label: 'Alta' }])) };
    mockConfig = { data: { id: '', ticketGroupId: 'g1' } };
    mockRef = { close: vi.fn() };
    mockTaskGroupService = { taskGroupMessageStatus: 'NotStarted' };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MyTaskForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MyTaskForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MyTaskForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_priority()).toEqual([]);
    expect(component.cb_ticket_group()).toEqual([]);
  });

  it('should have form with expected controls', () => {
    expect(component.form.contains('id')).toBe(true);
    expect(component.form.contains('title')).toBe(true);
    expect(component.form.contains('description')).toBe(true);
    expect(component.form.contains('priority')).toBe(true);
  });

  it('ngOnInit should load select items', async () => {
    await component.ngOnInit();
    expect(mockEnumSelectS.priorityLevel).toHaveBeenCalled();
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalled();
  });

  it('onSubmit should call api on create', async () => {
    component.id = '';
    component.form.patchValue({ title: 'Test', description: 'Desc', priority: 1 });
    component.onSubmit();
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onPost).toHaveBeenCalled();
  });
});

