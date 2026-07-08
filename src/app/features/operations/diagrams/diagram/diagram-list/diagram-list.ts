import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DialogService } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { DiagramForm } from "../diagram-form/diagram-form";
import { IDiagramDraw } from "../interfaces/diagram-draw";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconAdd } from "@ui/buttons/web-icon/button-add";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-diagram-list",
  imports: [
    WebButtonIcon,
    TooltipModule,
    WebButtonIconAdd,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabel,
    NgbTooltipModule,

    DataViewMobile,  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./diagram-list.html",
})
export class DiagramList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  private customerIdService = inject(CustomerIdService);

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
        this.dialogHandlerS.sizeLg,
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

  onDeleteDiagram(id: string) {
    this.apiResponseS.onDelete(Endpoints.DiagramDraw.delete(id)).then(() => {
      this.onLoadData();
    });
  }
}
