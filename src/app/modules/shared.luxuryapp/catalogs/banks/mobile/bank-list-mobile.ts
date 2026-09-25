import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonSearchbar,
  IonButtons,
  IonButton,
} from "@ionic/angular";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { BankDto } from "../interfaces/banks.dto";

@Component({
  selector: "app-bank-list-mobile",
  templateUrl: "./bank-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonIcon,
    IonSearchbar,
    IonButtons,
    IonButton,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    AppIcon,
  ],
})
export class BankListMobile {
  data = input.required<BankDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  query = signal("");
  visibleData = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.data();
    
    return this.data().filter(item => 
      [item.shortName, item.largeName, item.code]
        .filter(Boolean)
        .some(val => val.toLowerCase().includes(query))
    );
  });
}
