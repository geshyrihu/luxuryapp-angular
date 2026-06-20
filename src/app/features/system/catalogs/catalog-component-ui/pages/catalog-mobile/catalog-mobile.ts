import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSpinner,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  add,
  addOutline,
  checkmarkDone,
  checkmarkDoneOutline,
  chevronForwardOutline,
  close,
  closeOutline,
  cloudUploadOutline,
  documentTextOutline,
  ellipsisVertical,
  flashOutline,
  homeOutline,
  leafOutline,
  mailOutline,
  notificationsOutline,
  pencilOutline,
  pin,
  saveOutline,
  searchOutline,
  share,
  star,
  trash,
  trashOutline,
  waterOutline,
} from "ionicons/icons";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import {
  IonButtonAdd,
  IonButtonDelete,
  IonButtonEdit,
  IonButtonSave,
} from "src/app/core/components/buttons/mobile";
import {
  IonInputNumber,
  IonInputSelect,
  IonInputText,
  IonInputToggle,
} from "src/app/core/components/inputs/mobile";

@Component({
  selector: "app-catalog-mobile",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    TooltipModule,
    TabsModule,
    IonIcon,
    IonLabel,
    IonList,
    IonBadge,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonSpinner,
    IonAvatar,
    IonChip,
    IonButton,
    IonItem,
    IonItemDivider,
    IonButtonAdd,
    IonButtonEdit,
    IonButtonDelete,
    IonButtonSave,
    IonInputText,
    IonInputNumber,
    IonInputSelect,
    IonInputToggle,
    AppIcon,
  ],
  templateUrl: "./catalog-mobile.html",
  styleUrls: ["./catalog-mobile.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogMobile {
  mobileForm: FormGroup;
  options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];
  groupedDataExample: Record<
    string,
    { id: number; title: string; module: string; status: string }[]
  > = {
    "Hoy (23 Abr)": [
      {
        id: 1,
        title: "Revisión de Extintores",
        module: "Mantenimiento",
        status: "Pendiente",
      },
      {
        id: 2,
        title: "Corte de Caja Diario",
        module: "Finanzas",
        status: "Proceso",
      },
    ],
    "Mañana (24 Abr)": [
      {
        id: 3,
        title: "Junta de Comité",
        module: "Administración",
        status: "Urgente",
      },
    ],
  };

  constructor(private fb: FormBuilder) {
    addIcons({
      addOutline,
      pencilOutline,
      trashOutline,
      saveOutline,
      checkmarkDoneOutline,
      mailOutline,
      notificationsOutline,
      documentTextOutline,
      chevronForwardOutline,
      ellipsisVertical,
      searchOutline,
      closeOutline,
      cloudUploadOutline,
      flashOutline,
      waterOutline,
      leafOutline,
      homeOutline,
      star,
      checkmarkDone,
      trash,
      pin,
      close,
      add,
      share,
    });
    this.mobileForm = this.fb.group({
      nombre: [""],
      edad: [null],
      categoria: [null],
      activo: [true],
    });
  }
}
