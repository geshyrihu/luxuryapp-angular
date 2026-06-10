import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskGroupParticipant } from './task-group-participant';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('TaskGroupParticipant', () => {
  let component: TaskGroupParticipant;
  let fixture: ComponentFixture<TaskGroupParticipant>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
      onDelete: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockConfig = { data: { id: 'group-1' } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskGroupParticipant, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskGroupParticipant],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskGroupParticipant);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.submitting()).toBe(false);
    expect(component.loading_existing_participant()).toBe(false);
    expect(component.cb_existing_Participant()).toEqual([]);
    expect(component.cb_application_user()).toEqual([]);
  });

  it('should have form with expected controls', () => {
    expect(component.form.contains('ticketGroupId')).toBe(true);
    expect(component.form.contains('applicationUserId')).toBe(true);
    expect(component.form.contains('isAdmin')).toBe(true);
  });

  it('onLoadAppUsers should call api and set signal', async () => {
    const users = [{ value: 'u1', label: 'User 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(users);

    await component.onLoadAppUsers();
    expect(component.cb_application_user()).toEqual(users);
  });

  it('onSelectUser should patch form', () => {
    const item = { value: 'u1', label: 'User 1' };
    component.onSelectUser(item);
    expect(component.form.value.applicationUserId).toBe('u1');
    expect(component.form.value.applicationUser).toBe('User 1');
  });

  it('onSubmit should call api and clean form', async () => {
    component.onSubmit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
  });

  it('onDelete should remove item from signal', async () => {
    component.cb_existing_Participant.set([{ id: '1' }, { id: '2' }]);
    await component.onDelete('1');
    expect(component.cb_existing_Participant().length).toBe(1);
    expect(component.cb_existing_Participant()[0].id).toBe('2');
  });
});
