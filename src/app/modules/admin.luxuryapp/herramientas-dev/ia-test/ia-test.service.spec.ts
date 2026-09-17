import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IaTestService } from './ia-test.service';

describe('IaTestService', () => {
  let service: IaTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        IaTestService,
      ],
    });
    service = TestBed.inject(IaTestService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
