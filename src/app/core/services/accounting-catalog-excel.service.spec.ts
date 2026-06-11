import { TestBed } from '@angular/core/testing';
import { AccountingCatalogExcelService } from './accounting-catalog-excel.service';

describe('AccountingCatalogExcelService', () => {
  let service: AccountingCatalogExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountingCatalogExcelService],
    });
    service = TestBed.inject(AccountingCatalogExcelService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
