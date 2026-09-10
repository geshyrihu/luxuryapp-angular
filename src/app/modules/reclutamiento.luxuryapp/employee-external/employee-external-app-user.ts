import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { UpdatePasswordAccount } from "src/app/shared/user-account-access/update-password-account";
import { UpdateRole } from "src/app/shared/user-account-access/update-role";

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
