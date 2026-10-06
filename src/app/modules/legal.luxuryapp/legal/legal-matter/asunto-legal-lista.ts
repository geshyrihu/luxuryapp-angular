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
import { AsuntoLegalForm } from "@legal.luxuryapp/legal/legal-matter/asunto-legal-form";
import { CategoriaAsuntoLegalForm } from "@legal.luxuryapp/legal/legal-matter/categoria-asunto-legal-form";
import { addIcons } from "ionicons";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";
import { AsuntoLegalListaDesktop } from "./desktop/asunto-legal-lista-desktop";
import { AsuntoLegalListaMobile } from "./mobile/asunto-legal-lista-mobile";

@Component({
  selector: "app-asunto-legal-lista",
  templateUrl: "./asunto-legal-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsuntoLegalListaDesktop, AsuntoLegalListaMobile],
})
export class AsuntoLegalLista {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  constructor() {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.LegalMatters.getAll)
      .then((result: any) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result);
      });
  }

  // Funcion para eliminar un banco y refres
  async onDelete(id: any) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este asunto legal?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.LegalMatters.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(AsuntoLegalForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalEditCategorie(data: any) {
    this.dialogHandlerS
      .openDialog(
        CategoriaAsuntoLegalForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  async onDeleteCategorie(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta categoría?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.LegalMatters.deleteCategory(id))
      .then(() => {
        this.onLoadData();
      });
  }
}
