import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { InspeccionAgregarRevision } from "src/app/features/tenant/inspection/inspeccion-agregar-revision/inspeccion-agregar-revision";
import { InspeccionActivoCondominio } from "../inspeccion-activo-condominio-agregar/inspeccion-activo-condominio";
import { InspeccionActivoCondominioEditar } from "../inspeccion-activo-condominio-editar/inspeccion-activo-condominio-editar";

@Component({
  selector: "app-detalles-inspeccion",
  imports: [
    IonButtonEdit,
    IonButtonItem,
    IonButtonDelete,
    CommonModule,
    CustomButton,
    ActionMenu,
    TooltipModule,
  ],
  templateUrl: "./detalles-inspeccion.html",
})
export class DetallesInspeccion implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  data: any;

  nombre: string = "Equipos electromecánicos";
  areaResponsable: string = "Mantenimiento";
  id: string = this.activatedRoute.snapshot.paramMap.get("id");

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.InspectionCondominiumAssets.listByInspection(this.id))
      .then((result: any) => {
        this.data = result;
      });
  }

  onDeleteArea(id: string, areas: any[]) {
    this.apiResponseS
      .onDelete(Endpoints.InspectionCondominiumAssets.deleteArea(id))
      .then((result: any) => {
        if (result) {
          const index = areas.findIndex(
            (item) => item.inspectionCondominiumAssetId === id,
          );
          if (index !== -1) {
            areas.splice(index, 1);
          }
        }
      });
  }

  onDeleteReview(reviewId: any, reviews: any[]) {
    this.apiResponseS
      .onDelete(Endpoints.InspectionCondominiumAssets.deleteReview(reviewId))
      .then((result: any) => {
        if (result) {
          const index = reviews.findIndex((item) => item.id === reviewId);
          if (index !== -1) {
            reviews.splice(index, 1);
          }
        }
      });
  }

  onModalInspectionCondominiumAssetAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspeccionActivoCondominio,
        {
          inspectionId: this.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onModalInspectionCondominiumAssetEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspeccionActivoCondominioEditar,
        {
          inspectionId: data.inspectionId,
          inspectionCondominiumAssetId: data.inspectionCondominiumAssetId,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalAddRevision() {
    this.dialogHandlerS.openDialog(
      InspeccionAgregarRevision,
      { title: "Agregar área" },
      "Agregar revisión",
      this.dialogHandlerS.sizeLg,
    );
  }
}

