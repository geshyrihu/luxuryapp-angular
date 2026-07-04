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
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { IonInputCheckbox } from "src/app/core/components/inputs/mobile/ion-input-checkbox";
import { IonInputSelect } from "src/app/core/components/inputs/mobile/ion-input-select";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";

export const CATALOGO_GASTOS_FIJOS_LIST_MODULES = [
  ActionMenu,
  DataViewMobile,
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
