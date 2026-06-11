import { TestBed } from '@angular/core/testing';
import { AiChatService } from './ai-chat.service';
import { ApiResponseService } from './api-response.service';
import { CustomerIdService } from './customer-id.service';

describe('AiChatService', () => {
  let service: AiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AiChatService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]) } },
        { provide: CustomerIdService, useValue: { customerId: vi.fn(), customerDataReady: vi.fn() } },
      ],
    });
    service = TestBed.inject(AiChatService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
