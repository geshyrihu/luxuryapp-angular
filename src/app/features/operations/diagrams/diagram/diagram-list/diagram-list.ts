import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import { gitBranchOutline } from "ionicons/icons";
import { DialogService } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelAdd } from "src/app/core/components/buttons/web-label/button-add";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DiagramForm } from "../diagram-form/diagram-form";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-list",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabel,
    NgbTooltipModule,
    WebButtonLabelAdd,
    WebButtonLabelDelete,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
  providers: [DialogService],
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
    addIcons({ gitBranchOutline });
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
