import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { TaskTemplateForm } from './task-template-form';

describe('TaskTemplateForm', () => {
  let component: TaskTemplateForm;
  let fixture: ComponentFixture<TaskTemplateForm>;
  let mockApiResponseS: any;
  let mockRef: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      validateForm: vi.fn().mockReturnValue(true),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockRef = { close: vi.fn() };
    mockConfig = { data: {} };

    TestBed.overrideComponent(TaskTemplateForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TaskTemplateForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskTemplateForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.submitting()).toBe(false);
    expect(component.roles()).toEqual([]);
    expect(component.availableCustomers()).toEqual([]);
    expect(component.templateId()).toBeNull();
  });

  it('should have form with default values', () => {
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.isActive.value).toBe(true);
    expect(component.form.controls.customerIds.value).toEqual([]);
  });

  it('should load roles and customers on init', () => {
    const fakeRoles = [{ value: 'r1', label: 'Admin' }];
    const fakeCustomers = [{ value: 'c1', label: 'Customer 1' }];
    mockApiResponseS.onGetSelectItem
      .mockResolvedValueOnce(fakeRoles)
      .mockResolvedValueOnce(fakeCustomers);

    component.ngOnInit();

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith('ApplicationRoles');
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith('customers-active');
    expect(component.roles()).toEqual(fakeRoles);
    expect(component.availableCustomers()).toEqual(fakeCustomers);
  });

  it('should patch form values when editing existing template', () => {
    mockConfig.data = {
      template: {
        id: 'tmpl-1',
        name: 'Template 1',
        description: 'Desc',
        roleId: 'r1',
        isActive: true,
        customerIds: ['c1', 'c2'],
      },
    };

    component.ngOnInit();

    expect(component.templateId()).toBe('tmpl-1');
    expect(component.form.controls.name.value).toBe('Template 1');
    expect(component.form.controls.customerIds.value).toEqual(['c1', 'c2']);
  });

  it('should call validateForm on onSubmit', () => {
    component.onSubmit();

    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
  });
});
