import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { DatabaseBackupConfig } from "../interfaces/database-backup.interface";

@Component({
  selector: "app-database-backup-list-mobile",
  templateUrl: "./database-backup-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class DatabaseBackupListMobile {
  data = input.required<DatabaseBackupConfig[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<DatabaseBackupConfig>();
  execute = output<string>();
  delete = output<string>();
  testConnection = output<string>();

  destinationLabel(type: string): string {
    return type === "GraphApi" ? "OneDrive" : "Local";
  }
}
