import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { addIcons } from "ionicons";
import { clipboardOutline } from "ionicons/icons";
import { ListaPlantillaEvaluacionDesktop } from "./desktop/lista-plantilla-evaluacion-desktop";
import { ListaPlantillaEvaluacionMobile } from "./mobile/lista-plantilla-evaluacion-mobile";

@Component({
  selector: "app-lista-plantilla-evaluacion",
  templateUrl: "./lista-plantilla-evaluacion.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListaPlantillaEvaluacionDesktop, ListaPlantillaEvaluacionMobile],
})
export class ListaPlantillaEvaluacion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<any[]>([]);
  loading = signal(true);

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
    const urlApi = Endpoints.TemplateEvaluation.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  async onDelete(id: any) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta plantilla de evaluación?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.TemplateEvaluation.delete(id))
      .then(() => {
        this.dataSignal.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
      });
  }

  onCreate() {
    this.router.navigate(["/employee-evaluation/templates/create"]);
  }

  onEdit(templateId: string) {
    this.router.navigate(["/employee-evaluation/templates/edit", templateId]);
  }
}
