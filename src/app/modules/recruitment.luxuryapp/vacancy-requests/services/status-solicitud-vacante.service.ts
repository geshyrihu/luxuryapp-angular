import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class StatusSolicitudVacanteService {
  private positionRequestId: any | null = null;
  private employeeId: any | null = null;
  private workPositionId: any | null = null;
  // Método para agregar el positionRequestId
  public setPositionRequestId(id: any): void {
    this.positionRequestId = id;
  }

  // Método para extraer el positionRequestId
  public getPositionRequestId(): number | null {
    return this.positionRequestId;
  }

  // Método para agregar el employeeId
  public setemployeeId(id: any): void {
    this.employeeId = id;
  }

  // Método para extraer el employeeId
  public getemployeeId(): number | null {
    return this.employeeId;
  }

  // Método para agregar el workPositionId
  public setworkPositionId(id: any): void {
    this.workPositionId = id;
  }

  // Método para extraer el workPositionId
  public getworkPositionId(): number | null {
    return this.workPositionId;
  }
}









