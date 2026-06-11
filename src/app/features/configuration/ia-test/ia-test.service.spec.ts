import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { IaTestService } from './ia-test.service';

describe('IaTestService', () => {
  let service: IaTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        IaTestService,
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
      ],
    });
    service = TestBed.inject(IaTestService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});

