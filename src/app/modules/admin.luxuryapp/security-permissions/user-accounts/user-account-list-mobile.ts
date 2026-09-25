import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  IonAvatar,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
} from "@ionic/angular";
import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { UserAccountDto } from "./interfaces/user-account.dto";

@Component({
  selector: "app-user-account-list-mobile",
  templateUrl: "./user-account-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputSelect,
    IonAvatar,
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonSearchbar,
    IonAccordion,
    IonAccordionGroup,
    IonIcon,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    ReactiveFormsModule,
  ],
  styles: [
    `
      .user-account-mobile-filters {
        display: grid;
        gap: var(--ds-space-sm);
        margin-block: var(--ds-space-sm);
      }
    `,
  ],
})
export class UserAccountListMobile {
  readonly data = input.required<UserAccountDto[]>();
  readonly customers = input<SelectItemDto[]>([]);
  readonly typePeople = input<SelectItemDto[]>([]);
  readonly typePersonControl = input.required<FormControl<number>>();
  readonly active = input(true);

  readonly add = output<void>();
  readonly customerChange = output<string>();
  readonly typePersonChange = output<number>();
  readonly activeChange = output<boolean>();
  readonly employeeSelected = output<string>();
  readonly permissions = output<{ id: string; email: string }>();
  readonly edit = output<string>();
  readonly block = output<string>();
  readonly unlock = output<string>();
  readonly delete = output<string>();

  readonly query = signal("");
  readonly visibleData = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.data();

    return this.data().filter((item) =>
      [item.fullName, item.userName, item.customer, item.email, item.phoneNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  });
}
