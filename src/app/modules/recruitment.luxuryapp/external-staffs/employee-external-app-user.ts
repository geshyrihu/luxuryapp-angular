import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { UpdatePasswordAccount } from "@shared/user-account-access/update-password-account";
import { UpdateRole } from "@shared/user-account-access/update-role";

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

