import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { gitBranchOutline } from "ionicons/icons";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonAdd } from "src/app/core/components/buttons/web/custom-button-add";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DiagramForm } from "../diagram-form/diagram-form";
import { IDiagramDraw } from "../interfaces/diagram-draw";

@Component({
  selector: "app-diagram-list",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    NgbTooltipModule,
    CustomButtonAdd,
    CustomButtonDelete,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
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
    this.router.navigate(["/diagram/editor", id]);
  }

  onViewDiagram(id: string) {
    this.router.navigate(["/diagram/view", id]);
  }

  onOpenGallery() {
    this.router.navigate(["/diagram/gallery"]);
  }

  onDeleteDiagram(id: string) {
    this.apiResponseS.onDelete(`DiagramDraw/${id}`).then(() => {
      this.onLoadData();
    });
  }
}
