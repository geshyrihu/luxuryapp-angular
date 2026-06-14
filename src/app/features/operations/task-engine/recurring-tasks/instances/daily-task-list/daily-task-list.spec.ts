import { vi } from 'vitest';
import { signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { DailyTaskList } from './daily-task-list';

describe('DailyTaskList', () => {
  let component: DailyTaskList;
  let fixture: ComponentFixture<DailyTaskList>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockDateS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeMd: 'md',
    };
    mockDateS = {
      getDateNow: vi.fn().mockReturnValue('2026-06-09'),
    };
    mockTableScrollHeightS = {
      scrollHeight: signal('600px'),
    };

    TestBed.overrideComponent(DailyTaskList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [DailyTaskList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: DateService, useValue: mockDateS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DailyTaskList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.tasks()).toEqual([]);
    expect(component.loading()).toBe(false);
    expect(component.selectedDateControl.value).toBe('2026-06-09');
  });

  it('should load tasks on init', async () => {
    const fakeTasks = [{ id: '1', title: 'Task 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeTasks);

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/instances/my-daily-tasks?date=2026-06-09',
    );
    expect(component.tasks()).toEqual(fakeTasks);
    expect(component.loading()).toBe(false);
  });

  it('should set tasks to empty array when API returns null', async () => {
    mockApiResponseS.onGetList.mockResolvedValue(null);

    await component.loadTasks();

    expect(component.tasks()).toEqual([]);
  });

  it('should open complete dialog and reload tasks on result true', async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);
    const task = { id: 't1', title: 'Test' };

    await component.showCompleteDialog(task as any);

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { task },
      'Completar Tarea: Test',
      'md',
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });
});
