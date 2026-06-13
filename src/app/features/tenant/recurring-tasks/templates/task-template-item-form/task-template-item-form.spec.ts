import { vi } from 'vitest';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { TaskTemplateItemForm } from './task-template-item-form';

describe('TaskTemplateItemForm', () => {
  let component: TaskTemplateItemForm;
  let fixture: ComponentFixture<TaskTemplateItemForm>;
  let mockApiResponseS: any;
  let mockEnumSelectS: any;
  let mockRef: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockImplementation((f: any) => f.valid),
    };
    mockEnumSelectS = {
      onLoadEnumList: vi.fn().mockReturnValue(of([])),
    };
    mockRef = { close: vi.fn() };
    mockConfig = { data: { templateId: 'tmpl-1' } };

    TestBed.overrideComponent(TaskTemplateItemForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TaskTemplateItemForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskTemplateItemForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.submitting()).toBe(false);
    expect(component.priorities()).toEqual([]);
    expect(component.templateId()).toBeNull();
    expect(component.item()).toBeNull();
  });

  it('should have form with default values', () => {
    expect(component.form.controls.title.value).toBe('');
    expect(component.form.controls.isActive.value).toBe(true);
    expect(component.form.controls.priority.value).toBeNull();
    expect(component.form.controls.recurrenceRule.value).toBe('');
  });

  it('should load priorities on init', async () => {
    const fakePriorities = [{ value: 0, label: 'High' }];
    mockEnumSelectS.onLoadEnumList.mockReturnValue(of(fakePriorities));

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockEnumSelectS.onLoadEnumList).toHaveBeenCalledWith('EPriorityLevel');
    expect(component.priorities()).toEqual(fakePriorities);
  });

  it('should patch form values when editing existing item', () => {
    mockConfig.data = {
      templateId: 'tmpl-1',
      item: {
        id: 'item-1',
        title: 'Test Item',
        description: 'Desc',
        priority: 0,
        recurrenceRule: 'FREQ=DAILY',
        isActive: true,
      },
    };

    component.ngOnInit();

    expect(component.item()).toEqual(mockConfig.data.item);
    expect(component.form.controls.title.value).toBe('Test Item');
    expect(component.form.controls.recurrenceRule.value).toBe('FREQ=DAILY');
  });

  it('should parse time strings to Date on init', () => {
    mockConfig.data = {
      templateId: 'tmpl-1',
      item: {
        id: 'item-1',
        timeWindowStart: '09:00:00',
        timeWindowEnd: '17:30:00',
      },
    };

    component.ngOnInit();

    expect(component.form.controls.timeWindowStart.value).toBeInstanceOf(Date);
    expect(component.form.controls.timeWindowStart.value!.getHours()).toBe(9);
    expect(component.form.controls.timeWindowEnd.value!.getHours()).toBe(17);
    expect(component.form.controls.timeWindowEnd.value!.getMinutes()).toBe(30);
  });

  it('should not submit if form is invalid', () => {
    component.form.controls.title.setErrors({ required: true });

    component.onSubmit();

    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
  });

  it('should POST new item and close dialog on success', async () => {
    component.templateId.set('tmpl-1');
    component.form.patchValue({
      title: 'New Item',
      priority: 1,
      recurrenceRule: 'FREQ=DAILY',
    });

    component.onSubmit();

    expect(mockApiResponseS.onPost).toHaveBeenCalledWith(
      'recurring-tasks/templates/tmpl-1/items',
      expect.objectContaining({ title: 'New Item' }),
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it('should PUT existing item and close dialog on success', async () => {
    component.templateId.set('tmpl-1');
    component.item.set({ id: 'item-1' });
    component.form.patchValue({
      title: 'Updated Item',
      priority: 2,
      recurrenceRule: 'FREQ=WEEKLY',
    });

    component.onSubmit();

    expect(mockApiResponseS.onPut).toHaveBeenCalledWith(
      'recurring-tasks/templates/items/item-1',
      expect.objectContaining({ title: 'Updated Item' }),
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it('should not close dialog when API returns false', async () => {
    mockApiResponseS.onPost.mockResolvedValue(false);
    component.form.patchValue({ title: 'Test', priority: 1, recurrenceRule: 'FREQ=DAILY' });

    component.onSubmit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockRef.close).not.toHaveBeenCalled();
    expect(component.submitting()).toBe(false);
  });

  it('should parse time string correctly', () => {
    const result = (component as any).parseTime('14:30');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getHours()).toBe(14);
    expect(result!.getMinutes()).toBe(30);

    expect((component as any).parseTime(null)).toBeNull();
    expect((component as any).parseTime('')).toBeNull();
  });
});
