import { CommonModule, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

export const CATALOGO_GASTOS_FIJOS_LIST_MODULES = [
  ActionMenu,
  LuxDataViewMobile,
  TableEmptyMessage,
  CommonModule,
  LuxInputSelectSignal,
  FormsModule,
  IonInputCheckbox,
  IonInputSelect,
  LuxTableCaption,
  TableFooter,
  RouterModule,
  AppTable,
  AppSortableColumn,
  AppSorticon,
  LxTooltipDirective,
  UpperCasePipe,
];
