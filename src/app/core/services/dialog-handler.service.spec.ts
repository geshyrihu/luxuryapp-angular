import { TestBed } from '@angular/core/testing';
import { DialogHandlerService } from './dialog-handler.service';
import { DialogService } from '@core/services/dialog-handler.service';

describe('DialogHandlerService', () => {
  let service: DialogHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DialogHandlerService,
        { provide: DialogService, useValue: { open: vi.fn(), getInstance: vi.fn() } },
      ],
    });
    service = TestBed.inject(DialogHandlerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});

