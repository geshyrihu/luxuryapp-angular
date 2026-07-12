import { inject, Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Endpoints } from "../constants/endpoints";
@Injectable({
  providedIn: "root",
})
export class EnumSelectService {
  private readonly apiResponseS = inject(ApiResponseService);

  /**
   * Método para cargar una lista de elementos de un enumerado desde la API.
   */
  onLoadEnumList(
    nameEnum: string,
    defaultOption?: boolean,
  ): Observable<SelectItemDto[]> {
    const urlApi = Endpoints.EnumSelectItems.selectItemEnum(nameEnum, defaultOption !== undefined ? String(defaultOption) : undefined);

    return from(this.apiResponseS.onGetList<SelectItemDto[]>(urlApi)).pipe(
      map((result) => result || []),
      catchError((error) => {
        console.error(`Error al obtener ${nameEnum}:`, error);
        return of([]);
      }),
    );
  }

  /**
   * Método para cargar una lista de selección desde la API.
   */
  onLoadSelectList(nameEnum: string): Observable<SelectItemDto[]> {
    return from(
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(nameEnum),
    ).pipe(
      map((result) => result || []),
      catchError((error) => {
        console.error(`Error al obtener ${nameEnum}:`, error);
        return of([]);
      }),
    );
  }

  boolYesNo = () => this.onLoadSelectList("bool-yes-no");

  areaMinutasDetalles = (d?: boolean) =>
    this.onLoadEnumList("e-area-minutas-detalles", d);

  departament = (d?: boolean) => this.onLoadEnumList("e-departament", d);

  areaOrganigrama = (d?: boolean) => this.onLoadEnumList("e-area-organigrama", d);

  assetCategory = (d?: boolean) => this.onLoadEnumList("e-asset-category", d);

  bloodType = (d?: boolean) => this.onLoadEnumList("e-blood-type", d);

  companyArea = (d?: boolean) => this.onLoadEnumList("e-company-area", d);

  educationLevel = (d?: boolean) => this.onLoadEnumList("e-education-level", d);

  extinguisherType = (d?: boolean) =>
    this.onLoadEnumList("e-extinguisher-type", d);

  hydrantType = (d?: boolean) => this.onLoadEnumList("e-hydrant-type", d);

  cabinetState = (d?: boolean) => this.onLoadEnumList("e-cabinet-state", d);

  manualStationType = (d?: boolean) =>
    this.onLoadEnumList("e-manual-station-type", d);

  smokeDetectorType = (d?: boolean) =>
    this.onLoadEnumList("e-smoke-detector-type", d);

  severityLevel = (d?: boolean) => this.onLoadEnumList("e-severity-level", d);

  incidentCategory = (d?: boolean) =>
    this.onLoadEnumList("e-incident-category", d);

  frequencyType = (d?: boolean) => this.onLoadEnumList("e-frequency-type", d);

  fuenteReclutamiento = (d?: boolean) =>
    this.onLoadEnumList("e-fuente-reclutamiento", d);

  maritalStatus = (d?: boolean) => this.onLoadEnumList("e-marital-status", d);

  month(defaultOption?: boolean): Observable<SelectItemDto[]> {
    return this.onLoadEnumList("e-month", defaultOption).pipe(
      map((months) => months.sort((a, b) => a.value - b.value)),
    );
  }

  permission = (d?: boolean) => this.onLoadEnumList("e-permission", d);

  priorityLevel = (d?: boolean) => this.onLoadEnumList("e-priority-level", d);

  recurrence = (d?: boolean) => this.onLoadEnumList("e-recurrence", d);

  roleType = (d?: boolean) => this.onLoadEnumList("e-role-type", d);

  sex = (d?: boolean) => this.onLoadEnumList("e-sex", d);

  status = (d?: boolean) => this.onLoadEnumList("e-status", d);

  requestStatus = (d?: boolean) => this.onLoadEnumList("e-request-status", d);

  tipoBaja = (d?: boolean) => this.onLoadEnumList("e-tipo-baja", d);

  tipoGasto = (d?: boolean) => this.onLoadEnumList("e-tipo-gasto", d);

  turnoTrabajo = (d?: boolean) => this.onLoadEnumList("e-turno-trabajo", d);

  typeContract = (d?: boolean) => this.onLoadEnumList("e-type-contract", d);

  typePiscina = (d?: boolean) => this.onLoadEnumList("e-type-piscina", d);

  typeMaintance = (d?: boolean) => this.onLoadEnumList("e-type-maintance", d);

  typeContractRegister = (d?: boolean) =>
    this.onLoadEnumList("e-type-contract-register", d);

  typeMeeting = (d?: boolean) => this.onLoadEnumList("e-type-meeting", d);

  typeStatusOrdenCompra = (d?: boolean) =>
    this.onLoadEnumList("e-status-orden-compra", d);

  typePosicionComite = (d?: boolean) =>
    this.onLoadEnumList("e-posicion-comite", d);

  typeHabitant = (d?: boolean) => this.onLoadEnumList("e-habitant", d);

  typeTaskMessageStatus = (d?: boolean) =>
    this.onLoadEnumList("e-ticket-message-status", d);

  relationEmployee = (d?: boolean) =>
    this.onLoadEnumList("e-relation-employee", d);

  inventoryCategory = (d?: boolean) =>
    this.onLoadEnumList("e-inventory-category", d);

  state = (d?: boolean) => this.onLoadEnumList("e-state", d);

  typePerson = (d?: boolean) => this.onLoadEnumList("e-type-person", d);

  productClasificacion = (d?: boolean) =>
    this.onLoadEnumList("e-product-clasificacion", d);

  rolLevel = (d?: boolean) => this.onLoadEnumList("e-rol-level", d);

  visibilityLevel = (d?: boolean) => this.onLoadEnumList("e-visibility-level", d);

  requestType = (d?: boolean) => this.onLoadEnumList("e-request-type", d);

  expenseType = (d?: boolean) => this.onLoadEnumList("e-expense-type", d);

  investigationStatus = (d?: boolean) =>
    this.onLoadEnumList("e-investigation-status", d);

  memberRole = (d?: boolean) => this.onLoadEnumList("e-member-role", d);

  billingMode = (d?: boolean) => this.onLoadEnumList("e-billing-mode", d);
}
