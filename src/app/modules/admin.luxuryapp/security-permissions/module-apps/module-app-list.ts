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
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ModuleAppListDesktop } from "./desktop/module-app-list-desktop";
import { ModuleAppDto } from "./interfaces/module-app.dto";
import { ModuleAppListMobile } from "./mobile/module-app-list-mobile";
import { ModuleAppForm } from "./module-app-form";

@Component({
  selector: "app-module-app-list",
  imports: [ModuleAppListDesktop, ModuleAppListMobile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./module-app-list.html",
})
export class ModuleAppList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  constructor() {}

  // Declaración e inicialización de variables
  dataSignal = signal<ModuleAppDto[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<ModuleAppDto[]>(Endpoints.ModuleApps.getAll)
      .then((result) => {
        // Ordenar datos para agrupar por pathParent
        const sortedData = (result || []).sort((a, b) => {
          const pathParentA = a.pathParent || "";
          const pathParentB = b.pathParent || "";

          if (pathParentA < pathParentB) return -1;
          if (pathParentA > pathParentB) return 1;

          // If pathParent is the same, sort by nameModule
          if (a.nameModule < b.nameModule) return -1;
          if (a.nameModule > b.nameModule) return 1;

          return 0;
        });

        this.dataSignal.set(sortedData);
      });
  }

  // Funcion para eliminar un banco y refres
  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este módulo?",
    );
    if (!confirmed) return;
    this.apiResponseS.onDelete(Endpoints.ModuleApps.delete(id)).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ModuleAppForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
