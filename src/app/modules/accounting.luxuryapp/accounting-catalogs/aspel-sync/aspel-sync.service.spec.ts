import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AspelSyncService } from './aspel-sync.service';

describe('AspelSyncService', () => {
  let service: AspelSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AspelSyncService,
      ],
    });
    service = TestBed.inject(AspelSyncService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
