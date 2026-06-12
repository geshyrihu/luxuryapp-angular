import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { clipboardOutline } from "ionicons/icons";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-lista-plantilla-evaluacion",
  templateUrl: "./lista-plantilla-evaluacion.html",
  imports: [
    TableModule,
    TagModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class ListaPlantillaEvaluacion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  // óEsta es la magia!
  // Se recalcularó automóticamente SOLO si dataSignal cambia.
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ clipboardOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TemplateEvaluation/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.TemplateEvaluation.delete(id)).then(() => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    });
  }

  // Para crear
  onCreate() {
    this.router.navigate(["/employee-evaluation/templates/create"]);
  }

  // Para editar
  onEdit(templateId: string) {
    this.router.navigate(["/employee-evaluation/templates/edit", templateId]);
  }
}









