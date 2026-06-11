import { TestBed } from '@angular/core/testing';
import { EnumSelectService } from './enum-select.service';
import { ApiResponseService } from './api-response.service';

describe('EnumSelectService', () => {
  let service: EnumSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnumSelectService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(EnumSelectService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
