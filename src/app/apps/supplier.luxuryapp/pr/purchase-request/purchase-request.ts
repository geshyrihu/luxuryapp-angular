import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PurchaseRequestAddProduct } from "./purchase-request-add-product";
import { PurchaseRequestAddProductForm } from "./purchase-request-add-product-form";
import { PurchaseRequestForm } from "./purchase-request-form";
import { PurchaseRequestProducts } from "./purchase-request-products";
@Component({
  selector: "app-purchase-request",
  templateUrl: "./purchase-request.html",
  imports: [
    WebButtonLabelItem,
    CommonModule,
    ActionMenu,
    PurchaseRequestAddProduct,
    PurchaseRequestProducts,
    AppIcon,
    LxTag,
  ],
})
export class PurchaseRequest implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  router = inject(Router);
  dialogHandlerS = inject(DialogHandlerService);
  purchaseRequestId: any = this.activatedRoute.snapshot.params.id;

  // Variable para pasar el producto a editar al formulario
  productToEdit: any | null = null;
  purchaseOrders: any;
  data: any;
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.PurchaseRequests.getDetail(this.purchaseRequestId);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.purchaseOrders = result.purchaseOrders;
    });
  }
  getTagSeverity(status: string): string {
    switch (status) {
      case "Autorizado":
        return "text-success";
      case "Pendiente":
        return "text-warning";
      case "Denegado":
        return "text-danger";
    }
  }

  // PurchaseRequestComponent
  handleEditProductRequest(productData: any) {
    this.productToEdit = productData;
  }

  // método para limpiar el producto a editar una vez que el formulario se haya reseteado o enviado
  clearProductToEdit() {
    this.productToEdit = null;
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddProduct(data: any) {
    this.dialogHandlerS
      .openDialog(
        PurchaseRequestAddProductForm,
        { purchaseRequestId: data.purchaseRequestId },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PurchaseRequestForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onNavigatePage(route: string) {
    this.router.navigateByUrl(route);
  }
}
