import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-employee-emergency-contact-list-desktop",
  templateUrl: "./employee-emergency-contact-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIcon,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
  ],
})
export class EmployeeEmergencyContactListDesktop {
  dataEmergencyContact = input.required<any[]>();
  dataBeneficiary = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);

  add = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  edit = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  delete = output<{ id: string; typeContact: number }>();
}
