import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxCheckbox } from "@ui/adaptive/checkbox/checkbox";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PermissionDto } from "src/app/core/interfaces/permission.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
// import { EmployeeAddOrEditService } from './employee-form.service';

@Component({
  selector: "employee-permission-app",
  templateUrl: "./employee-permission-app.html",
  imports: [FormsModule, LxCheckbox],
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
      .onGetItem(`permission/PermissionUserAdmin/${this.applicationUserId()}/`)
      .then((result: any) => {
        this.data = result;
      });
  }
  onCheckboxChange(permission: PermissionDto, field: string, checked: boolean) {
    // Actualiza el campo correspondiente en el objeto de permiso
    permission[field] = checked;

    // Aqué envéas la solicitud para actualizar los permisos
    this.apiResponseS.onPut(
      Endpoints.Permission.update(permission.id),
      permission,
      false,
    );
  }
}
