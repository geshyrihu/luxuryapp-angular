import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { MyTaskProgram } from './my-task-program';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('MyTaskProgram', () => {
  let component: MyTaskProgram;
  let fixture: ComponentFixture<MyTaskProgram>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockDateS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue({ assigneeId: 'user-2', scheduledDate: '2024-03-01' }),
      onPost: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockDateS = { parseDate: vi.fn().mockReturnValue(new Date('2024-03-01')), getDateFormat: vi.fn().mockReturnValue('2024-03-01') };
    mockConfig = { data: { id: 'ticket-123' } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MyTaskProgram, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MyTaskProgram],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DateService, useValue: mockDateS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MyTaskProgram);
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
    expect(component.form.contains('scheduledDate')).toBe(true);
    expect(component.form.contains('assigneeId')).toBe(true);
    expect(component.form.contains('applicationUserId')).toBe(true);
  });

  it('onLoadData should call api and patch form', async () => {
    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
    expect(component.form.value.assigneeId).toBe('user-2');
  });

  it('onSubmit should call api and close ref on success', async () => {
    component.onSubmit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });
});
