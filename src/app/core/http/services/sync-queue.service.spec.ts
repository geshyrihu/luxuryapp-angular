import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SyncQueueService } from './sync-queue.service';
import { ConnectivityService } from '../../services/connectivity.service';
import { ConsoleLoggerService } from '../../services/console-logger.service';
import { of } from 'rxjs';

describe('SyncQueueService', () => {
  let service: SyncQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SyncQueueService,
        { provide: ConnectivityService, useValue: { isOnline$: of(true) } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn(), error: vi.fn() } },
        { provide: Injector, useValue: { get: vi.fn().mockReturnValue({}) } },
      ],
    });
    service = TestBed.inject(SyncQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose queueLength$ observable', (done) => {
    service.queueLength$.subscribe((length) => {
      expect(typeof length).toBe('number');
      done();
    });
  });
});
