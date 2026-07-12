import { Endpoints } from "src/app/core/constants/endpoints";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class TaskGroupService {
  year: number = 0;
  numeroSemana: number = 0;
  /**
   *
   */
  constructor() {
    this.setCurrentWeekAndYear();
  }

  setCurrentWeekAndYear(): void {
    const now = new Date();
    // Construir fecha UTC para evitar diferencias de zona horaria con el servidor
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    this.year = todayUtc.getUTCFullYear();
    this.numeroSemana = this.getWeekNumber(todayUtc);
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  taskGroupMessageStatus: any = 0;

  messageInNotRead: number = 0;
  // Método para establecer el status y guardarlo en localStorage
  setStatus(taskGroupMessageStatus: any): void {
    this.taskGroupMessageStatus = taskGroupMessageStatus;
  }

  onLoadDataMessageInNotRead(): void {
    // const urlApi = Endpoints.RefactorOperations.ticketsMessageInNotReadById(this.authS.applicationUserId);
    // this.apiResponseS.onGetList(urlApi).then((result: any) => {
    //   this.messageInNotRead = result;
    // });
  }
}









