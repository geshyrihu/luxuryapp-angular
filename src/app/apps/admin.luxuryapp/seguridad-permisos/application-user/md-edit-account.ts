import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { AccessCustomer } from "../acceso-customer/access-customer";
import { UpdatePasswordAccount } from "./update-password-account";
import { UpdateRole } from "./update-role";
@Component({
  selector: "app-md-edit-account",
  templateUrl: "./edit-account.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpdatePasswordAccount, UpdateRole, AccessCustomer],
})
export class MdEditAccount implements OnInit {
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  cb_emplyee: SelectItemDto[] = [];
  data: any;
  applicationUserId: string = "";
  email: string = "";
  public AspRole = ApplicationRole;

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
  }
}
