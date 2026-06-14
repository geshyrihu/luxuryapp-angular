import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CompleteTaskForm } from './complete-task-form';

describe('CompleteTaskForm', () => {
  let component: CompleteTaskForm;
  let fixture: ComponentFixture<CompleteTaskForm>;
  let mockApiResponseS: any;
  let mockRef: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockRef = { close: vi.fn() };
    mockConfig = { data: { task: { id: 'task-1', title: 'Test Task' } } };

    TestBed.overrideComponent(CompleteTaskForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CompleteTaskForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CompleteTaskForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should init form and task from config on ngOnInit', () => {
    component.ngOnInit();
    expect(component.task).toEqual({ id: 'task-1', title: 'Test Task' });
    expect(component.form).toBeDefined();
    expect(component.form.controls.comments).toBeDefined();
    expect(component.form.controls.attachments).toBeDefined();
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.form.controls.comments.setErrors({ required: true });
    component.onSubmit();
    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });

  it('should call API and close dialog on successful submit', async () => {
    mockApiResponseS.onPost.mockResolvedValue(true);
    component.ngOnInit();
    component.form.patchValue({ comments: 'Done!', attachments: [] });

    component.onSubmit();

    expect(mockApiResponseS.onPost).toHaveBeenCalledWith(
      'recurring-tasks/instances/task-1/complete',
      { comments: 'Done!' },
    );
    expect(component.submitting()).toBe(true);
    await new Promise(resolve => setTimeout(resolve));
    expect(mockRef.close).toHaveBeenCalledWith(true);
    expect(component.submitting()).toBe(false);
  });

  it('should not close dialog when API returns false', async () => {
    mockApiResponseS.onPost.mockResolvedValue(false);
    component.ngOnInit();
    component.form.patchValue({ comments: 'Failed', attachments: [] });

    component.onSubmit();

    await new Promise(resolve => setTimeout(resolve));
    expect(mockRef.close).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
  });
});
