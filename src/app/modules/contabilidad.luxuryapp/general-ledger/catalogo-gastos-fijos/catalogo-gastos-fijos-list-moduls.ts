import { CommonModule, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
import { MessageModule } from "@ui/web/primeng-message/primeng-message";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";

export const CATALOGO_GASTOS_FIJOS_LIST_MODULES = [
  ActionMenu,
  DataViewMobile,
  CommonModule,
  WebButtonLabel,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  CustomInputSelectSignal,
  FormsModule,
  InputTextModule,
  IonInputCheckbox,
  IonInputSelect,
  MessageModule,
  PrimeNgCustomCaption,
  PrimeNgCustomTableFooter,
  RouterModule,
  TableModule,
  TagModule,
  LxTooltipDirective,
  UpperCasePipe,
];
