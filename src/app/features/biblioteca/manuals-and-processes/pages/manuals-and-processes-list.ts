import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { bookOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { IManualTemplateSimpleDTO } from "../models/manuals-and-processes.dto";
import { ManualsAndProcessesForm } from "./manuals-and-processes-form";

@Component({
  selector: "app-manuals-and-processes-list",
  templateUrl: "./manuals-and-processes-list.html",
  styleUrl: "./manuals-and-processes-list.scss",
  standalone: true,
  imports: [
    ActionMenu,
    CustomButton,
    CustomButtonDelete,
    CustomButtonEdit,
    DataViewMobile,
    IonButtonDelete,
    IonButtonEdit,
    IonIcon,
    IonItem,
    IonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    TableModule,
  ],
})
export class ManualsAndProcessesList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public aspRoleS = inject(AspRoleService);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly EApplicationRole = EApplicationRole;

  dataSignal = signal<IManualTemplateSimpleDTO[]>([]);
  loading = signal(true);

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ bookOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<IManualTemplateSimpleDTO[]>(Endpoints.ManualsPasos.getAll)
      .then((result) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onViewTemplate(id: string) {
    this.router.navigate(["/library/manuals-and-processes/detail", id]);
  }

  onOpenEditor(id: string) {
    this.router.navigate(["/library/manuals-and-processes/editor", id]);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ManualsAndProcessesForm,
        data,
        data?.id ? "Editar Manual" : "Nuevo Manual",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(data: any) {
    this.apiResponseS
      .onDelete(Endpoints.ManualsPasos.delete(data.id))
      .then((res) => {
        if (res) {
          this.dataSignal.update((current) =>
            current.filter((i) => i.id !== data.id),
          );
        }
      });
  }
}
