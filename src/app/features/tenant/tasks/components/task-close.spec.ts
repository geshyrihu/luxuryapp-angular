import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskClose } from './task-close';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Endpoints } from 'src/app/core/constants/endpoints';

describe('TaskClose', () => {
  let component: TaskClose;
  let fixture: ComponentFixture<TaskClose>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDateS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue({ closedDate: '2024-01-15' }),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue('cust-001') };
    mockDateS = { getDateFormat: vi.fn().mockReturnValue('2024-01-15') };
    mockConfig = { data: { id: 'ticket-123' } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskClose, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskClose],
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

    fixture = TestBed.createComponent(TaskClose);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.submitting()).toBe(false);
    expect(component.id).toBe('ticket-123');
  });

  it('should have form with expected controls', () => {
    expect(component.form.get('id')).not.toBeNull();
    expect(component.form.contains('closedDate')).toBe(true);
    expect(component.form.contains('beforeWork')).toBe(true);
    expect(component.form.contains('afterWork')).toBe(true);
    expect(component.form.contains('customerId')).toBe(true);
  });

  it('onLoadData should call api and patch form', async () => {
    const mockResult = { closedDate: '2024-01-15', beforeWorkPreview: 'img1', afterWorkPreview: 'img2' };
    mockApiResponseS.onGetItem.mockResolvedValue(mockResult);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(Endpoints.Tasks.getByClosed('ticket-123'));
    expect(component.form.controls.customerId.value).toBe('cust-001');
  });
});
