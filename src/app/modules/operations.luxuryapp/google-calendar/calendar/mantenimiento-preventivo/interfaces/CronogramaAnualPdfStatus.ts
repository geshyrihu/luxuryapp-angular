export interface CronogramaAnualPdfStatusItem {
  id: any;
  month: number;
  typeMaintance: number;
  year: number;
  serviceOrderStatus: string;
}

export interface CronogramaAnualPdfStatus {
  id: any;
  sistema: string;
  inventoryCategory: number;
  nameMachinery: string;
  items: CronogramaAnualPdfStatusItem[];
}
