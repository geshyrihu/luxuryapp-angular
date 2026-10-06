import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { VaultSecretSummary } from "../interfaces/vault-secret.model";

@Component({
  selector: "app-vault-secrets-list-mobile",
  templateUrl: "./vault-secrets-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class VaultSecretsListMobile {
  data = input.required<VaultSecretSummary[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<VaultSecretSummary>();
  rotate = output<string>();
  revoke = output<string>();
}
