import { IonicMocks } from 'src/app/core/testing/ionic-mocks';

vi.mock('@ionic/angular/standalone', () => ({ ...IonicMocks }));
vi.mock('@ionic/core', () => ({}));
vi.mock('@ionic/core/components', () => ({}));
vi.mock('ionicons/icons', () => ({ storefrontOutline: 'storefront-outline' }));
vi.mock('ionicons', () => ({ addIcons: vi.fn() }));

import { vi } from 'vitest';
import { signal } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { TaskInstanceList } from './task-instance-list';

describe('TaskInstanceList', () => {
  let component: TaskInstanceList;
  let fixture: ComponentFixture<TaskInstanceList>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockDateS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
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

    TestBed.overrideComponent(TaskInstanceList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TaskInstanceList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: DateService, useValue: mockDateS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskInstanceList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.data()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.selectedDateControl.value).toBe('2026-06-09');
  });

  it('should load data on init', () => {
    const fakeData = [{ id: '1', title: 'Task 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);

    component.ngOnInit();

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/instances/my-daily-tasks?date=2026-06-09',
    );
  });

  it('should set data to response on successful load', () => {
    const fakeData = [{ id: '1', title: 'Task 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);

    component.onLoadData();

    expect(component.loading()).toBe(true);
  });

  it('should set data to empty array when API returns null', async () => {
    mockApiResponseS.onGetList.mockResolvedValue(null);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it('should set data to response on successful load (promise resolved)', async () => {
    const fakeData = [{ id: '1', title: 'Task 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data()).toEqual(fakeData);
    expect(component.loading()).toBe(false);
  });

  it('should open complete dialog and reload on result true', async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);
    const task = { id: 't1', title: 'Test' };

    component.onCompleteTask(task as any);

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { task },
      'Completar Tarea',
      'md',
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it('should reopen task and reload on success', async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);
    mockApiResponseS.onPost.mockResolvedValue(true);

    component.onReopenTask('task-1');

    expect(mockApiResponseS.onPost).toHaveBeenCalledWith(
      'recurring-tasks/instances/task-1/reopen',
      {},
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it('should not reload on reopen when API returns false', async () => {
    mockApiResponseS.onPost.mockResolvedValue(false);
    await new Promise(resolve => setTimeout(resolve));
    mockApiResponseS.onGetList.mockClear();

    component.onReopenTask('task-1');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).not.toHaveBeenCalled();
  });
});
