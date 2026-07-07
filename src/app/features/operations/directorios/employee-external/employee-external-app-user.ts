import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { UpdatePasswordAccount } from "../../../system/access/application-user/pages/update-password-account";
import { UpdateRole } from "../../../system/access/application-user/pages/update-role";

@Component({
  selector: "app-employee-external-app-user",
  imports: [UpdateRole, UpdatePasswordAccount],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./employee-external-app-user.html",
})
export class EmployeeExternalAppUser {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  applicationUserId = input<string>(this.config.data?.applicationUserId ?? "");
}
