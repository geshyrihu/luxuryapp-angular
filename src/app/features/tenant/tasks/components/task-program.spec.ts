import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskProgram } from './task-program';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('TaskProgram', () => {
  let component: TaskProgram;
  let fixture: ComponentFixture<TaskProgram>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDateS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue({ assigneeId: 'user-2', scheduledDate: '2024-03-01' }),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockDateS = { parseDate: vi.fn().mockReturnValue(new Date('2024-03-01')), getDateFormat: vi.fn().mockReturnValue('2024-03-01') };
    mockConfig = { data: { id: 'ticket-123', ticketGroupId: 'group-1' } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskProgram, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskProgram],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DateService, useValue: mockDateS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskProgram);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_user()).toEqual([]);
  });

  it('should have form with expected controls', () => {
    expect(component.form.get('id')).not.toBeNull();
    expect(component.form.contains('scheduledDate')).toBe(true);
    expect(component.form.contains('assigneeId')).toBe(true);
  });

  it('onLoadUsers should call api and set cb_user', async () => {
    const users = [{ value: 'u1', label: 'User 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(users);
    await component.onLoadUsers();
    expect(component.cb_user()).toEqual(users);
  });

  it('saveUserId should patch form', () => {
    const item = { value: 'u1', label: 'User 1' };
    component.saveUserId(item);
    expect(component.form.value.assigneeId).toBe('u1');
    expect(component.form.value.assignee).toBe('User 1');
  });
});
