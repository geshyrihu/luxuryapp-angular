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
import { ModuleAppRolListDesktop } from "./desktop/module-app-rol-list-desktop";
import { ModuleAppRolDto } from "./interfaces/module-app-rol.dto";
import { ModuleAppRolListMobile } from "./mobile/module-app-rol-list-mobile";
import { ModuleAppRolUpdate } from "./module-app-rol-update";

@Component({
  selector: "app-module-app-rol",
  imports: [ModuleAppRolListDesktop, ModuleAppRolListMobile],
  templateUrl: "./module-app-rol-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleAppRol {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  dataSignal = signal<ModuleAppRolDto[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  groupedData = computed(() => {
    const data = this.dataSignal();
    return data.reduce((acc: any, item) => {
      const key = item.roleType || "Otros";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  });
  constructor() {}

  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<ModuleAppRolDto[]>(Endpoints.ModuleAppRoles.listRole)
      .then((result) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result || []);
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS.openDialog(
      ModuleAppRolUpdate,
      data,
      data.title,
      this.dialogHandlerS.sizeFull,
    );
  }
}
