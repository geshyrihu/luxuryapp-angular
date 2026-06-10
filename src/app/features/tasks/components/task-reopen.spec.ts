import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskReopen } from './task-reopen';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('TaskReopen', () => {
  let component: TaskReopen;
  let fixture: ComponentFixture<TaskReopen>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: 'user-001' };
    mockConfig = { data: { id: 'ticket-123' } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReopen, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReopen],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReopen);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should have form with expected controls', () => {
    expect(component.form.contains('applicationUserId')).toBe(true);
    expect(component.form.contains('ticketMessageId')).toBe(true);
    expect(component.form.contains('description')).toBe(true);
  });

  it('ngOnInit should patch form values', () => {
    component.ngOnInit();
    expect(component.form.value.applicationUserId).toBe('user-001');
    expect(component.form.value.ticketMessageId).toBe('ticket-123');
    expect(component.form.value.userCreateId).toBe('user-001');
  });
});
