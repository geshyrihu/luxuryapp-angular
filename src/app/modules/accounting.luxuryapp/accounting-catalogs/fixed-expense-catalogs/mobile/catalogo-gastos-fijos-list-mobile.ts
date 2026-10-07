import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxAccordion } from "@ui/adaptive/accordion/accordion";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { ButtonMobile } from "@ui/buttons/mobile";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileBadge } from "@ui/mobile/badge/badge";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-catalogo-gastos-fijos-list-mobile",
  templateUrl: "./catalogo-gastos-fijos-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    FormsModule,
    LxAccordion,
    LxTabs,
    IonInputCheckbox,
    IonInputSelect,
    MobileActionMenu,
    MobileBadge,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class CatalogoGastosFijosListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  fundingYear = input<number>(new Date().getFullYear());
  cbFundingYear = input<SelectItemDto[]>([]);
  monthTabs = input<{ id: string; label: string }[]>([]);
  selectedMonthName = input<string | null>(null);
  isGenerationParamsSelected = input<boolean>(false);
  isFirstQuincenaGenerationBlocked = input<boolean>(false);
  isSecondQuincenaGenerationBlocked = input<boolean>(false);
  canManage = input<boolean>(false);

  yearChange = output<number>();
  selectMonth = output<string>();
  generateQuincena = output<number>();
  selectByQuincena = output<number>();
  create = output<void>();
  loadData = output<void>();
  itemCheckChange = output<{ item: any; checked: boolean }>();
  modal = output<{ id: string; title: string }>();
  delete = output<any>();

  /** Accordion móvil (una sola sección colapsable). */
  genAccordionItems = [
    { id: "generation", title: "Generar órdenes de Compra" },
  ];
  genExpanded = signal<string[]>([]);
}
