import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { OrdenCompraService } from './orden-compra.service';

describe('OrdenCompraService', () => {
  let service: OrdenCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdenCompraService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(OrdenCompraService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
