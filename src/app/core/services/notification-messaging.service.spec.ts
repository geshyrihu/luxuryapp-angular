import { TestBed } from '@angular/core/testing';
import { MessagingService } from './notification-messaging.service';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagingService],
    });
    service = TestBed.inject(MessagingService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
