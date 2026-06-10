import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { vi } from 'vitest';
import { TaskReadList } from './task-read-list';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

describe('TaskReadList', () => {
  let component: TaskReadList;
  let fixture: ComponentFixture<TaskReadList>;
  let mockApiResponseS: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockConfig = { data: { id: 'ticket-123' } };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReadList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReadList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReadList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.ticketMessageId).toBe('ticket-123');
    expect(component.data).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it('onLoadData should call api and set data', async () => {
    const mockData = [{ id: '1', userName: 'User A' }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data).toEqual(mockData);
  });
});
