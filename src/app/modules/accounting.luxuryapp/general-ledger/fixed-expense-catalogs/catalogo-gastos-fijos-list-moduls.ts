import { CommonModule, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableFooter } from "@ui/web/table-footer/table-footer";

export const CATALOGO_GASTOS_FIJOS_LIST_MODULES = [
  ActionMenu,
  DataViewMobile,
  CommonModule,
  WebButtonLabel,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  CustomInputSelectSignal,
  FormsModule,
  IonInputCheckbox,
  IonInputSelect,
  TableCaption,
  TableFooter,
  RouterModule,
  AppTable,
  AppSortableColumn,
  AppSorticon,
  LxTooltipDirective,
  UpperCasePipe,
];
