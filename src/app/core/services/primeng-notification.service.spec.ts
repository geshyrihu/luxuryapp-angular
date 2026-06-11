import { TestBed } from '@angular/core/testing';
import { PrimeNgNotificationService } from './primeng-notification.service';
import { MessageService } from 'primeng/api';

describe('PrimeNgNotificationService', () => {
  let service: PrimeNgNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrimeNgNotificationService,
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    });
    service = TestBed.inject(PrimeNgNotificationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
