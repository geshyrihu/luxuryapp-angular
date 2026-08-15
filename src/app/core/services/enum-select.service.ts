import { inject, Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Endpoints } from "../constants/endpoints/endpoints";
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
    const urlApi = Endpoints.EnumSelectItems.selectItemEnum(
      nameEnum,
      defaultOption !== undefined ? String(defaultOption) : undefined,
    );

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

  boolYesNo = () => this.onLoadSelectList("boolean-options");

  areaMinutasDetalles = (d?: boolean) =>
    this.onLoadEnumList("area-minutas-detalles", d);

  departament = (d?: boolean) => this.onLoadEnumList("departament", d);

  areaOrganigrama = (d?: boolean) => this.onLoadEnumList("area-organigrama", d);

  assetCategory = (d?: boolean) => this.onLoadEnumList("asset-category", d);

  bloodType = (d?: boolean) => this.onLoadEnumList("blood-type", d);

  companyArea = (d?: boolean) => this.onLoadEnumList("company-area", d);

  educationLevel = (d?: boolean) => this.onLoadEnumList("education-level", d);

  extinguisherType = (d?: boolean) =>
    this.onLoadEnumList("extinguisher-type", d);

  hydrantType = (d?: boolean) => this.onLoadEnumList("hydrant-type", d);

  cabinetState = (d?: boolean) => this.onLoadEnumList("cabinet-state", d);

  manualStationType = (d?: boolean) =>
    this.onLoadEnumList("manual-station-type", d);

  smokeDetectorType = (d?: boolean) =>
    this.onLoadEnumList("smoke-detector-type", d);

  severityLevel = (d?: boolean) => this.onLoadEnumList("severity-level", d);

  incidentCategory = (d?: boolean) =>
    this.onLoadEnumList("incident-category", d);

  frequencyType = (d?: boolean) => this.onLoadEnumList("frequency-type", d);

  fuenteReclutamiento = (d?: boolean) =>
    this.onLoadEnumList("fuente-reclutamiento", d);

  recruitmentDocumentType = (d?: boolean) =>
    this.onLoadEnumList("recruitment-document-type", d);

  maritalStatus = (d?: boolean) => this.onLoadEnumList("marital-status", d);

  month(defaultOption?: boolean): Observable<SelectItemDto[]> {
    return this.onLoadEnumList("month", defaultOption).pipe(
      map((months) => months.sort((a, b) => a.value - b.value)),
    );
  }

  permission = (d?: boolean) => this.onLoadEnumList("permission", d);

  priorityLevel = (d?: boolean) => this.onLoadEnumList("priority-level", d);

  recurrence = (d?: boolean) => this.onLoadEnumList("recurrence", d);

  roleType = (d?: boolean) => this.onLoadEnumList("role-type", d);

  sex = (d?: boolean) => this.onLoadEnumList("sex", d);

  status = (d?: boolean) => this.onLoadEnumList("status", d);

  requestStatus = (d?: boolean) => this.onLoadEnumList("request-status", d);

  tipoBaja = (d?: boolean) => this.onLoadEnumList("tipo-baja", d);

  tipoGasto = (d?: boolean) => this.onLoadEnumList("tipo-gasto", d);

  turnoTrabajo = (d?: boolean) => this.onLoadEnumList("turno-trabajo", d);

  typeContract = (d?: boolean) => this.onLoadEnumList("type-contract", d);

  typePiscina = (d?: boolean) => this.onLoadEnumList("type-piscina", d);

  typeMaintance = (d?: boolean) => this.onLoadEnumList("type-maintance", d);

  typeContractRegister = (d?: boolean) =>
    this.onLoadEnumList("type-contract-register", d);

  typeMeeting = (d?: boolean) => this.onLoadEnumList("type-meeting", d);

  typeStatusOrdenCompra = (d?: boolean) =>
    this.onLoadEnumList("status-orden-compra", d);

  typePosicionComite = (d?: boolean) =>
    this.onLoadEnumList("posicion-comite", d);

  typeHabitant = (d?: boolean) => this.onLoadEnumList("habitant", d);

  typeTaskMessageStatus = (d?: boolean) =>
    this.onLoadEnumList("ticket-message-status", d);

  relationEmployee = (d?: boolean) =>
    this.onLoadEnumList("relation-employee", d);

  inventoryCategory = (d?: boolean) =>
    this.onLoadEnumList("inventory-category", d);

  state = (d?: boolean) => this.onLoadEnumList("state", d);

  typePerson = (d?: boolean) => this.onLoadEnumList("type-person", d);

  productClasificacion = (d?: boolean) =>
    this.onLoadEnumList("product-clasificacion", d);

  rolLevel = (d?: boolean) => this.onLoadEnumList("rol-level", d);

  visibilityLevel = (d?: boolean) => this.onLoadEnumList("visibility-level", d);

  expenseType = (d?: boolean) => this.onLoadEnumList("expense-type", d);

  investigationStatus = (d?: boolean) =>
    this.onLoadEnumList("investigation-status", d);

  memberRole = (d?: boolean) => this.onLoadEnumList("member-role", d);

  billingMode = (d?: boolean) => this.onLoadEnumList("billing-mode", d);
}
