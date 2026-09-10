import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { TaskReport } from './task-report';

describe('TaskReport', () => {
  let component: TaskReport;
  let fixture: ComponentFixture<TaskReport>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReport, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReport],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReport);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
