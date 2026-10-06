import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DialogService,
} from "@core/services/dialog-handler.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ROUTES } from "src/app/routing/route-paths";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { DiagramForm } from "../diagram-form/diagram-form";

import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";


import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-list",
  imports: [
    ButtonWeb,
    ButtonMobile,
    LxIcon,
    MobileListItem,
    WebButtonIcon,
    LxTooltipDirective,
    MobileActionMenu,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    NgbTooltipModule,

    DataViewMobile,
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./diagram-list.html",
})
export class DiagramList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  private customerIdService = inject(CustomerIdService);
  private confirmS = inject(ConfirmService);

  loading = signal(true);
  diagrams = signal<IDiagramDraw[]>([]);

  constructor() {
    // Recargar datos si cambia el customerId en contexto
    effect(() => {
      if (this.customerIdService.customerId()) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    const customerId = this.customerIdService.customerId();
    if (!customerId) return;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IDiagramDraw>(`DiagramDraw?customerId=${customerId}`)
      .then((result: any) => {
        this.diagrams.set(result);
        this.loading.set(false);
      });
  }

  onAddDiagram() {
    this.onModalForm({ id: "" });
  }

  onEditDiagram(id: string) {
    this.onModalForm({ id });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        DiagramForm,
        data,
        data.id ? "Editar Propiedades" : "Nuevo Diagrama",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onOpenEditor(id: string) {
    this.router.navigate(ROUTES.DIAGRAMAS.EDITOR(id));
  }

  onViewDiagram(id: string) {
    this.router.navigate(ROUTES.DIAGRAMAS.VER(id));
  }

  onOpenGallery() {
    this.router.navigate(ROUTES.DIAGRAMAS.GALERIA);
  }

  async onDeleteDiagram(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este diagrama?",
    );
    if (!confirmed) return;
    this.apiResponseS.onDelete(Endpoints.DiagramDraw.delete(id)).then(() => {
      this.onLoadData();
    });
  }
}
