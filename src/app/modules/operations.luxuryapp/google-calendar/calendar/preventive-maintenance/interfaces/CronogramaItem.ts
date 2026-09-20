import { MaintenanceCalendar } from "./MaintenanceCalendar";
export interface CronogramaItem {
  id: any;
  inventoryCategory: number;
  nameMachinery: string;
  sistema: string;
  maintenanceCalendars: MaintenanceCalendar[]; // Usamos la interfaz definida
}









