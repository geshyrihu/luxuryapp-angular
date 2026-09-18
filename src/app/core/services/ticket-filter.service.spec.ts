import { TestBed } from '@angular/core/testing';
import { TicketFilterService } from './ticket-filter.service';
import { AuthService } from '../auth/services/auth.service';
import { CustomerIdService } from '../auth/services/customer-id.service';

describe('TicketFilterService', () => {
  let service: TicketFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketFilterService,
        { provide: AuthService, useValue: {} },
        { provide: CustomerIdService, useValue: { customerId: vi.fn() } },
      ],
    });
    service = TestBed.inject(TicketFilterService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
