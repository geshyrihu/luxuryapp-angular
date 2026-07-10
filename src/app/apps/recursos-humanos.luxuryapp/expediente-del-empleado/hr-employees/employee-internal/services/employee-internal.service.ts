import { Injectable, inject } from "@angular/core";
import { IEmployee } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employees/models/employee.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
@Injectable({
  providedIn: "root",
})
export class EmployeeInternalService {
  private _apiResponseS = inject(ApiResponseService);

  // ==========================================================================
  // READ OPERATIONS
  // ==========================================================================

  getList(customerId: string, active: boolean) {
    return this._apiResponseS.onGetList<IEmployee[]>(
      Endpoints.EmployeeInternal.list(customerId, active),
    );
  }

  getPrincipalData(applicationUserId: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.principalData(applicationUserId),
    ); // Replace specific DTO if available in interfaces
  }

  getPhotoPath(applicationUserId: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.photoPath(applicationUserId),
    );
  }

  getPersonalData(employeeId: any) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.personalData(employeeId),
    );
  }

  getLaboralData(applicationUserId: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.laboralData(applicationUserId),
    );
  }

  getAddressData(employeeId: any) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.addressData(employeeId),
    );
  }

  getDataForRecoveryPassword(applicationUserId: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeInternal.dataForRecoveryPassword(applicationUserId),
    );
  }

  validateState(applicationUserId: string) {
    return this._apiResponseS.onGetItem<boolean>(
      Endpoints.EmployeeInternal.onValidateState(applicationUserId),
    );
  }

  // ==========================================================================
  // CREATE OPERATIONS
  // ==========================================================================

  createEmployee(data: FormData) {
    return this._apiResponseS.onPost<{ id: string }>(
      Endpoints.Employees.createEmployee,
      data,
    );
  }

  createEmployeeExternal(data: FormData) {
    return this._apiResponseS.onPost<{ id: string }>(
      Endpoints.Employees.createEmployeeExternal,
      data,
    );
  }

  // ==========================================================================
  // UPDATE OPERATIONS
  // ==========================================================================

  updatePrincipalData(applicationUserId: string, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeInternal.updatePrincipalData(applicationUserId),
      data,
    );
  }

  updateImage(applicationUserId: string, data: FormData) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeInternal.updateImage(applicationUserId),
      data,
    );
  }

  updatePersonalData(employeeId: any, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeInternal.updatePersonalData(employeeId),
      data,
    );
  }

  updateLaboralData(applicationUserId: string, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeInternal.updateLaboralData(applicationUserId),
      data,
    );
  }

  updateAddressData(addressId: string, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeInternal.updateAddressData(addressId),
      data,
    );
  }

  updateBankData(id: string, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeBankData.getById(id),
      data,
    );
  }

  updateClinicalData(id: string, data: any) {
    return this._apiResponseS.onPut<any>(
      Endpoints.EmployeeClinicalData.getById(id),
      data,
    );
  }

  // ==========================================================================
  // EMPLOYEE BANK DATA
  // ==========================================================================

  getBankData(employeeId: string) {
    return this._apiResponseS.onGetList<any[]>(
      Endpoints.EmployeeBankData.byEmployee(employeeId),
    );
  }

  getBankDataById(id: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeBankData.getById(id),
    );
  }

  createBankData(data: any) {
    return this._apiResponseS.onPost<any>(
      Endpoints.EmployeeBankData.base,
      data,
    );
  }

  deleteBankData(id: string) {
    return this._apiResponseS.onDelete(Endpoints.EmployeeBankData.delete(id));
  }

  // ==========================================================================
  // EMPLOYEE CLINICAL DATA
  // ==========================================================================

  getClinicalData(employeeId: string) {
    return this._apiResponseS.onGetList<any[]>(
      Endpoints.EmployeeClinicalData.byEmployee(employeeId),
    );
  }

  getClinicalDataById(id: string) {
    return this._apiResponseS.onGetItem<any>(
      Endpoints.EmployeeClinicalData.getById(id),
    );
  }

  createClinicalData(data: any) {
    return this._apiResponseS.onPost<any>(
      Endpoints.EmployeeClinicalData.base,
      data,
    );
  }

  deleteClinicalData(id: string) {
    return this._apiResponseS.onDelete(
      Endpoints.EmployeeClinicalData.delete(id),
    );
  }

  // ==========================================================================
  // CATALOGS / SELECTS
  // ==========================================================================

  getApplicationRoles() {
    return this._apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.applicationRolesToAdministrator,
    );
  }

  searchExistingPerson(fullName: string) {
    return this._apiResponseS.onGetListNotLoading<any>(
      Endpoints.ApplicationUsers.searchExistingPerson(fullName),
    );
  }

  searchExistingPhone(phone: string) {
    return this._apiResponseS.onGetListNotLoading<any>(
      Endpoints.ApplicationUsers.searchExistingPhone(phone),
    );
  }
}
