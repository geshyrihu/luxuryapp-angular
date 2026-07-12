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

  boolYesNo = () => this.onLoadSelectList("BoolYesNo");

  areaMinutasDetalles = (d?: boolean) =>
    this.onLoadEnumList("AreaMinutasDetalles", d);

  departament = (d?: boolean) => this.onLoadEnumList("Departament", d);

  areaOrganigrama = (d?: boolean) => this.onLoadEnumList("EAreaOrganigrama", d);

  assetCategory = (d?: boolean) => this.onLoadEnumList("EAssetCategory", d);

  bloodType = (d?: boolean) => this.onLoadEnumList("EBloodType", d);

  companyArea = (d?: boolean) => this.onLoadEnumList("ECompanyArea", d);

  educationLevel = (d?: boolean) => this.onLoadEnumList("EEducationLevel", d);

  extinguisherType = (d?: boolean) =>
    this.onLoadEnumList("EExtinguisherType", d);

  hydrantType = (d?: boolean) => this.onLoadEnumList("EHydrantType", d);

  cabinetState = (d?: boolean) => this.onLoadEnumList("ECabinetState", d);

  manualStationType = (d?: boolean) =>
    this.onLoadEnumList("EManualStationType", d);

  smokeDetectorType = (d?: boolean) =>
    this.onLoadEnumList("ESmokeDetectorType", d);

  severityLevel = (d?: boolean) => this.onLoadEnumList("ESeverityLevel", d);

  incidentCategory = (d?: boolean) =>
    this.onLoadEnumList("EIncidentCategory", d);

  frequencyType = (d?: boolean) => this.onLoadEnumList("EFrequencyType", d);

  fuenteReclutamiento = (d?: boolean) =>
    this.onLoadEnumList("EFuenteReclutamiento", d);

  maritalStatus = (d?: boolean) => this.onLoadEnumList("EMaritalStatus", d);

  month(defaultOption?: boolean): Observable<SelectItemDto[]> {
    return this.onLoadEnumList("EMonth", defaultOption).pipe(
      map((months) => months.sort((a, b) => a.value - b.value)),
    );
  }

  permission = (d?: boolean) => this.onLoadEnumList("EPermission", d);

  priorityLevel = (d?: boolean) => this.onLoadEnumList("EPriorityLevel", d);

  recurrence = (d?: boolean) => this.onLoadEnumList("Recurrence", d);

  roleType = (d?: boolean) => this.onLoadEnumList("RoleType", d);

  sex = (d?: boolean) => this.onLoadEnumList("ESex", d);

  status = (d?: boolean) => this.onLoadEnumList("EStatus", d);

  requestStatus = (d?: boolean) => this.onLoadEnumList("ERequestStatus", d);

  tipoBaja = (d?: boolean) => this.onLoadEnumList("ETipoBaja", d);

  tipoGasto = (d?: boolean) => this.onLoadEnumList("TipoGasto", d);

  turnoTrabajo = (d?: boolean) => this.onLoadEnumList("ETurnoTrabajo", d);

  typeContract = (d?: boolean) => this.onLoadEnumList("ETypeContract", d);

  typePiscina = (d?: boolean) => this.onLoadEnumList("ETypePiscina", d);

  typeMaintance = (d?: boolean) => this.onLoadEnumList("ETypeMaintance", d);

  typeContractRegister = (d?: boolean) =>
    this.onLoadEnumList("ETypeContractRegister", d);

  typeMeeting = (d?: boolean) => this.onLoadEnumList("ETypeMeeting", d);

  typeStatusOrdenCompra = (d?: boolean) =>
    this.onLoadEnumList("EStatusOrdenCompra", d);

  typePosicionComite = (d?: boolean) =>
    this.onLoadEnumList("EPosicionComite", d);

  typeHabitant = (d?: boolean) => this.onLoadEnumList("EHabitant", d);

  typeTaskMessageStatus = (d?: boolean) =>
    this.onLoadEnumList("ETaskMessageStatus", d);

  relationEmployee = (d?: boolean) =>
    this.onLoadEnumList("ERelationEmployee", d);

  inventoryCategory = (d?: boolean) =>
    this.onLoadEnumList("EInventoryCategory", d);

  state = (d?: boolean) => this.onLoadEnumList("EState", d);

  typePerson = (d?: boolean) => this.onLoadEnumList("ETypePerson", d);

  productClasificacion = (d?: boolean) =>
    this.onLoadEnumList("EProductClasificacion", d);

  rolLevel = (d?: boolean) => this.onLoadEnumList("ERolLevel", d);

  visibilityLevel = (d?: boolean) => this.onLoadEnumList("EVisibilityLevel", d);

  requestType = (d?: boolean) => this.onLoadEnumList("ERequestType", d);

  expenseType = (d?: boolean) => this.onLoadEnumList("EExpenseType", d);

  investigationStatus = (d?: boolean) =>
    this.onLoadEnumList("EInvestigationStatus", d);

  memberRole = (d?: boolean) => this.onLoadEnumList("EMemberRole", d);

  billingMode = (d?: boolean) => this.onLoadEnumList("EBillingMode", d);
}
