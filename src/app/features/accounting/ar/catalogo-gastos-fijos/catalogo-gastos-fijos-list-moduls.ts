import { CommonModule, UpperCasePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";

export const CATALOGO_GASTOS_FIJOS_LIST_MODULES = [
  ActionMenu,
  DataViewMobile,
  PrimeNgCustomTableEmptyMessage,
  CheckboxModule,
  CommonModule,
  WebButtonLabel,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  CustomInputSelectSignal,
  FormsModule,
  InputTextModule,
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonButton,
  IonIcon,
  IonInputCheckbox,
  IonInputSelect,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  MessageModule,
  PrimeNgCustomCaption,
  PrimeNgCustomTableFooter,
  RouterModule,
  TableModule,
  TagModule,
  TooltipModule,
  UpperCasePipe,
];
