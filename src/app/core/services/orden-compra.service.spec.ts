import { TestBed } from '@angular/core/testing';
import { OrdenCompraService } from './orden-compra.service';
import { ApiResponseService } from './api-response.service';

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
