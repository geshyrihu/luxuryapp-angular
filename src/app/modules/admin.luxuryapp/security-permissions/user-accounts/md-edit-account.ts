import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { UpdatePasswordAccount } from "@shared/user-account-access/update-password-account";
import { UpdateRole } from "@shared/user-account-access/update-role";
import { AccessCustomer } from "../customer-access/access-customer";
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

