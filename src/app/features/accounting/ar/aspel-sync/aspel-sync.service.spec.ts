import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { AspelSyncService } from './aspel-sync.service';

describe('AspelSyncService', () => {
  let service: AspelSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AspelSyncService,
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
      ],
    });
    service = TestBed.inject(AspelSyncService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
