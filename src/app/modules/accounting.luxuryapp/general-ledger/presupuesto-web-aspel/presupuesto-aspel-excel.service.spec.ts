import { TestBed } from '@angular/core/testing';
import { PresupuestoAspelExcelService } from './presupuesto-aspel-excel.service';

describe('PresupuestoAspelExcelService', () => {
  let service: PresupuestoAspelExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresupuestoAspelExcelService],
    });
    service = TestBed.inject(PresupuestoAspelExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
