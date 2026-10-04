import { CommonModule, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
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
  DataViewMobile,
  TableEmptyMessage,
  CommonModule,
  WebButtonLabel,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  CustomInputSelectSignal,
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
