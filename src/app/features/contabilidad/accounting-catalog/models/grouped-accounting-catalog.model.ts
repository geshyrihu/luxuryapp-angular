import { AccountingCatalogDTO } from "./accounting-catalog.model";


export interface GroupedAccountingCatalogDTO {
  cuentaPadre: string;
  //   descripcionCuentaPadre: string;
  childAccounts: AccountingCatalogDTO[];
}









