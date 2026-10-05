import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CatalogoDescripcionForm } from "src/app/modules/operations.luxuryapp/delivery-receptions/delivery-reception/catalogo-descripcion-form";
import { CatalogoDescripcionListDesktop } from "./desktop/catalogo-descripcion-list-desktop";
import { CatalogoDescripcionListMobile } from "./mobile/catalogo-descripcion-list-mobile";

@Component({
  selector: "app-catalogo-descripcion-list",
  templateUrl: "./catalogo-descripcion-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogoDescripcionListDesktop, CatalogoDescripcionListMobile],
})
export class CatalogoDescripcionList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.EntregaRecepcion.base;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogoDescripcionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.EntregaRecepcion.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }
}
