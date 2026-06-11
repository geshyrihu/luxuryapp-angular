import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DataConnectorService } from './data-connector.service';
import { SignalRService } from './signalr.service';

describe('DataConnectorService', () => {
  let service: DataConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DataConnectorService,
        { provide: SignalRService, useValue: { connectionId: vi.fn() } },
      ],
    });
    service = TestBed.inject(DataConnectorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
