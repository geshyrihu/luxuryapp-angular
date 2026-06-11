import { TestBed } from '@angular/core/testing';
import { SolicitudCompraService } from './solicitud-compra.service';

describe('SolicitudCompraService', () => {
  let service: SolicitudCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolicitudCompraService],
    });
    service = TestBed.inject(SolicitudCompraService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
