import { AccountingCatalogDTO } from "./accounting-catalog.model";

// import { AccountingCatalogExcelService } from "./services/accounting-catalog-excel.service";
export interface AccountingCatalogWithParent extends AccountingCatalogDTO {
  cuentaPadre: string;
}
