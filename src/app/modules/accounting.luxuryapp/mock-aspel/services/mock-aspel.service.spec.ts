import { TestBed } from '@angular/core/testing';
import { MockAspelService } from './mock-aspel.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MockAspelService', () => {
  let service: MockAspelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockAspelService],
    });
    service = TestBed.inject(MockAspelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCuentas', () => {
    service.getCuentas().subscribe();
    const req = httpMock.expectOne('/api/AspelCOI/Cuentas');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
