import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TarjetaProveedor } from "src/app/features/purchasing/providers/provider/provider-card";

@Component({
  selector: "app-datos-servicio-addoredit",
  templateUrl: "./datos-servicio-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxTag],
})
export class DatosServicioAddOrEdit implements OnInit {
  config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  data: any;
  proveedores: any[];

  ngOnInit(): void {
    this.data = this.config.data;
    this.proveedores = this.config.data.proveedores ?? [];
  }

  onDataProveedor(id: any) {
    this.dialogHandlerS.openDialog(
      TarjetaProveedor,
      { providerId: id },
      "Datos de proveedor",
      this.dialogHandlerS.sizeLg,
    );
  }
}

