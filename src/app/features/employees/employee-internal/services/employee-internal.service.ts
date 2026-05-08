import { Injectable, inject } from "@angular/core";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IEmployee } from "src/app/features/employees/employees/models/employee.interface";
@Injectable({
  providedIn: "root",
})
export class EmployeeInternalService {
  private _apiResponseS = inject(ApiResponseService);

  // ==========================================================================
  // READ OPERATIONS
  // ==========================================================================

  getList(customerId: string, active: boolean) {
    const urlApi = `EmployeeInternal/list/${customerId}/${active}`;
    return this._apiResponseS.onGetList<IEmployee[]>(urlApi);
  }

  getPrincipalData(applicationUserId: string) {
    const urlApi = `EmployeeInternal/PrincipalData/${applicationUserId}`;
    return this._apiResponseS.onGetItem<any>(urlApi); // Replace specific DTO if available in interfaces
  }

  getPhotoPath(applicationUserId: string) {
    const urlApi = `EmployeeInternal/PhotoPath/${applicationUserId}`;
    return this._apiResponseS.onGetItem<any>(urlApi);
  }

  getPersonalData(employeeId: any) {
    const urlApi = `EmployeeInternal/PersonalData/${employeeId}`;
    return this._apiResponseS.onGetItem<any>(urlApi);
  }

  getLaboralData(applicationUserId: string) {
    const urlApi = `EmployeeInternal/LaboralData/${applicationUserId}`;
    return this._apiResponseS.onGetItem<any>(urlApi);
  }

  getAddressData(employeeId: any) {
    const urlApi = `EmployeeInternal/AddressData/${employeeId}`;
    return this._apiResponseS.onGetItem<any>(urlApi);
  }

  getDataForRecoveryPassword(applicationUserId: string) {
    const urlApi = `EmployeeInternal/DataForRecoveryPassword/${applicationUserId}`;
    return this._apiResponseS.onGetItem<any>(urlApi);
  }

  validateState(applicationUserId: string) {
    const urlApi = `EmployeeInternal/OnValidateState/${applicationUserId}`;
    return this._apiResponseS.onGetItem<boolean>(urlApi);
  }

  // ==========================================================================
  // CREATE OPERATIONS
  // ==========================================================================

  createEmployee(data: FormData) {
    const urlApi = `Employees/CreateEmployee`;
    return this._apiResponseS.onPost<{ id: string }>(urlApi, data);
  }

  createEmployeeExternal(data: FormData) {
    const urlApi = `Employees/CreateEmployeeExternal`;
    return this._apiResponseS.onPost<{ id: string }>(urlApi, data);
  }

  // ==========================================================================
  // UPDATE OPERATIONS
  // ==========================================================================

  updatePrincipalData(applicationUserId: string, data: any) {
    const urlApi = `EmployeeInternal/UpdatePrincipalData/${applicationUserId}`;
    return this._apiResponseS.onPut<any>(urlApi, data);
  }

  updateImage(applicationUserId: string, data: FormData) {
    const urlApi = `EmployeeInternal/UpdateImage/${applicationUserId}`;
    return this._apiResponseS.onPut<any>(urlApi, data);
  }

  updatePersonalData(employeeId: any, data: any) {
    const urlApi = `EmployeeInternal/UpdatePersonalData/${employeeId}`;
    return this._apiResponseS.onPut<any>(urlApi, data);
  }

  updateLaboralData(applicationUserId: string, data: any) {
    const urlApi = `EmployeeInternal/UpdateLaboralData/${applicationUserId}`;
    return this._apiResponseS.onPut<any>(urlApi, data);
  }

  updateAddressData(addressId: string, data: any) {
    const urlApi = `EmployeeInternal/UpdateAddressData/${addressId}`;
    return this._apiResponseS.onPut<any>(urlApi, data);
  }

  // ==========================================================================
  // CATALOGS / SELECTS
  // ==========================================================================

  getApplicationRoles() {
    return this._apiResponseS.onGetSelectItem<ISelectItem[]>(
      "application-roles-to-administrator",
    );
  }

  searchExistingPerson(fullName: string) {
    const urlApi = `application-users/SearchExistingPerson/${fullName}`;
    return this._apiResponseS.onGetListNotLoading<any>(urlApi);
  }

  searchExistingPhone(phone: string) {
    const urlApi = `application-users/SearchExistingPhone/${phone}`;
    return this._apiResponseS.onGetListNotLoading<any>(urlApi);
  }
}
