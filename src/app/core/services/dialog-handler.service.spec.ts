import { TestBed } from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogHandlerService } from './dialog-handler.service';
import { DialogService } from '@core/services/dialog-handler.service';

describe('DialogHandlerService', () => {
  let service: DialogHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DialogHandlerService,
        { provide: ModalController, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: Platform, useValue: { is: vi.fn(() => false), ready: vi.fn().mockResolvedValue(undefined) } },
        { provide: DialogService, useValue: { open: vi.fn(), getInstance: vi.fn() } },
      ],
    });
    service = TestBed.inject(DialogHandlerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});

