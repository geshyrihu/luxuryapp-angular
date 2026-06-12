import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { PermissionDTO } from "src/app/core/interfaces/permission.dto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
// import { EmployeeAddOrEditService } from './employee-form.service';
import { CommonModule } from "@angular/common";
@Component({
  selector: "employee-permission-app",
  templateUrl: "./employee-permission-app.html",
  imports: [CommonModule, FormsModule, CheckboxModule],
})
export class EmployeePermissionApp implements OnInit {
  apiResponseS = inject(ApiResponseService);
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  authS = inject(AuthService);
  customToastService = inject(CustomToastService);
  applicationUserId = input<string>("");

  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(`Permission/PermissionUserAdmin/${this.applicationUserId()}/`)
      .then((result: any) => {
        this.data = result;
      });
  }
  onCheckboxChange(permission: PermissionDTO, field: string, checked: boolean) {
    // Actualiza el campo correspondiente en el objeto de permiso
    permission[field] = checked;

    // Aquí envías la solicitud para actualizar los permisos
    this.apiResponseS.onPut(Endpoints.Permission.update(permission.id), permission, false);
  }
}
