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
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CatalogoRevisionesInspeccionForm } from "./catalogo-revisiones-inspeccion-form";
import { CatalogoRevisionesInspeccionDesktop } from "./desktop/catalogo-revisiones-inspeccion-desktop";
import { CatalogoRevisionesInspeccionMobile } from "./mobile/catalogo-revisiones-inspeccion-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-catalogo-revisiones-inspeccion",
  imports: [
    CatalogoRevisionesInspeccionDesktop,
    CatalogoRevisionesInspeccionMobile,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalogo-revisiones-inspeccion.html",
})
export class CatalogoRevisionesInspeccion {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  cb_departament = signal<SelectItemDto[]>([]);

  /*
  /PRIME NG TABLE OPTIONS
  */
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  /*
  /PRIME NG TABLE OPTIONS
  */
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadDepartament();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.InspectionReviewCatalog.getAll)
      .then((result: any) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(
          result.map((item: any) => ({
            ...item,
            categoria: item.equipoClasificacion?.descripcion ?? "Sin categoría",
          })),
        );
      });
  }

  onLoadDepartament() {
    this.apiResponseS
      .onGetEnumSelectItem(Endpoints.EnumSelectItems.departament)
      .then((result: any) => {
        this.cb_departament.set(result);
      });
  }

  // Funcion para eliminar un banco y refres
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.InspectionReviewCatalog.delete(id))
      .then(() => {
        // Actualizamos el signal para eliminar el elemento de la lista
        this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogoRevisionesInspeccionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
