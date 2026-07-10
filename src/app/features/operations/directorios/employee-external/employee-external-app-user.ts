import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { UpdatePasswordAccount } from "../../../../apps/admin.luxuryapp/application-user/update-password-account";
import { UpdateRole } from "../../../../apps/admin.luxuryapp/application-user/update-role";

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
