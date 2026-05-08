import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { EBoolTextPipe } from "src/app/core/pipes/bool-text.pipe";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-orden-compra-status-parcial",
  templateUrl: "./orden-compra-status-parcial.html",
  imports: [
    MessageModule,
    TagModule,
    SkeletonModule,
    CustomButton,
    EBoolTextPipe,
    CardModule,
  ],
})
export class OrdenCompraStatusParcial {
  dialogHandlerS = inject(DialogHandlerService);
  @Input()
  ordenCompra: any;
  @Input()
  mostrarTabla: boolean;
  @Input()
  ordenCompraPresupuestoUtilizado: boolean;
  @Input()
  bloqueada: boolean;
  @Output()
  modalOrdenCompra: EventEmitter<string> = new EventEmitter();

  onModalOrdenCompraStatus() {
    this.modalOrdenCompra.emit();
  }
}









