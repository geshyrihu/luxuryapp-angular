import { Component, inject, Input } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { UpdatePasswordAccount } from "../../configuration/application-user/pages/update-password-account";
import { UpdateRole } from "../../configuration/application-user/pages/update-role";

@Component({
  selector: "app-employee-external-app-user",
  imports: [UpdateRole, UpdatePasswordAccount],
  templateUrl: "./employee-external-app-user.html",
})
export class EmployeeExternalAppUser {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  @Input()
  applicationUserId: string = this.config.data.applicationUserId;
}
