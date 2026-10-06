import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
import { CatalogoActivoForm } from "./catalogo-activo-form";
import { CatalogoActivoListaDesktop } from "./desktop/catalogo-activo-lista-desktop";
import { CatalogoActivoListaMobile } from "./mobile/catalogo-activo-lista-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-catalogo-activo-lista",
  imports: [CatalogoActivoListaDesktop, CatalogoActivoListaMobile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalogo-activo-lista.html",
})
export class CatalogoActivoLista {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  // Declaracion e inicializacion de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);

  ref: DynamicDialogRef; // Referencia a un cuadro de dialogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CatalogAssets.getAll)
      .then((result: any) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result);
      });
  }

  // Funcion para eliminar un banco y refres
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS.onDelete(Endpoints.CatalogAssets.delete(id)).then(() => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(
        this.dataSignal().filter((item: any) => item.id !== id),
      );
    });
  }

  // Funcion para abrir un cuadro de dialogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogoActivoForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
