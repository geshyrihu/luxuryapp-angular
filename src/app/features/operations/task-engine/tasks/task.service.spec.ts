import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TaskGroupService } from './task.service';

describe('TaskGroupService', () => {
  let service: TaskGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskGroupService],
    });
    service = TestBed.inject(TaskGroupService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values', () => {
    expect(service.year).toBeGreaterThan(0);
    expect(service.numeroSemana).toBeGreaterThan(0);
    expect(service.taskGroupMessageStatus).toBe(0);
    expect(service.messageInNotRead).toBe(0);
  });

  it('setStatus should update taskGroupMessageStatus', () => {
    service.setStatus(2);
    expect(service.taskGroupMessageStatus).toBe(2);
  });

  it('setCurrentWeekAndYear should set valid values', () => {
    service.year = 0;
    service.numeroSemana = 0;
    service.setCurrentWeekAndYear();
    expect(service.year).toBeGreaterThan(0);
    expect(service.numeroSemana).toBeGreaterThan(0);
  });

  it('getWeekNumber should return a number between 1 and 53', () => {
    const week = service.getWeekNumber(new Date('2024-06-15'));
    expect(week).toBeGreaterThanOrEqual(1);
    expect(week).toBeLessThanOrEqual(53);
  });
});
