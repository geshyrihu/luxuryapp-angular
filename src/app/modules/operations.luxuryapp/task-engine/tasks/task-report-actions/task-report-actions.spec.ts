import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { TaskReportActions } from './task-report-actions';

describe('TaskReportActions', () => {
  let component: TaskReportActions;
  let fixture: ComponentFixture<TaskReportActions>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReportActions, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReportActions],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReportActions);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onPreview should emit previewClicked', () => {
    const spy = vi.spyOn(component.previewClicked, 'emit');
    component.onPreview();
    expect(spy).toHaveBeenCalled();
  });

  it('onSendReport should emit sendReportClicked', () => {
    const spy = vi.spyOn(component.sendReportClicked, 'emit');
    component.onSendReport();
    expect(spy).toHaveBeenCalled();
  });
});
