import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { InspeccionAgregarRevision } from "src/app/apps/mantenimiento.luxuryapp/inspection/inspeccion-agregar-revision/inspeccion-agregar-revision";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { InspeccionActivoCondominio } from "../inspeccion-activo-condominio-agregar/inspeccion-activo-condominio";
import { InspeccionActivoCondominioEditar } from "../inspeccion-activo-condominio-editar/inspeccion-activo-condominio-editar";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-detalles-inspeccion",
  imports: [
    WebButtonIcon,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    CommonModule,
    ActionMenu,
    LxTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./detalles-inspeccion.html",
})
export class DetallesInspeccion implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  data: any;

  nombre: string = "Equipos electromecónicos";
  areaResponsable: string = "Mantenimiento";
  id: string = this.activatedRoute.snapshot.paramMap.get("id");

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(
        Endpoints.InspectionCondominiumAssets.listByInspection(this.id),
      )
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
