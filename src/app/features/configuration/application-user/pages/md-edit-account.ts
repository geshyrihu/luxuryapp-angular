import { Component, inject, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { AccessCustomer } from "../../acceso-customer/pages/access-customer";
import { UpdatePasswordAccount } from "./update-password-account";
import { UpdateRole } from "./update-role";
@Component({
  selector: "app-md-edit-account",
  templateUrl: "./edit-account.html",
  imports: [UpdatePasswordAccount, UpdateRole, AccessCustomer],
})
export class MdEditAccount implements OnInit {
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  cb_emplyee: ISelectItem[] = [];
  data: any;
  applicationUserId: string = "";
  email: string = "";
  public AspRole = EApplicationRole;

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
  }
}









