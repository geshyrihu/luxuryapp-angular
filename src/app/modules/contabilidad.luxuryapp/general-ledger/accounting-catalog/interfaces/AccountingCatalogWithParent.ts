import { AccountingCatalogDTO } from "./accounting-catalog.model";

// import { AccountingCatalogExcelService } from "./accounting-catalog-excel.service";
export interface AccountingCatalogWithParent extends AccountingCatalogDTO {
  cuentaPadre: string;
}
