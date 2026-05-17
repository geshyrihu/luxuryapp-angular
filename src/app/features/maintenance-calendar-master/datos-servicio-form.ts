import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TarjetaProveedor } from "src/app/features/provider/provider-card";
@Component({
  selector: "app-datos-servicio-addoredit",
  templateUrl: "./datos-servicio-form.html",
  imports: [ReactiveFormsModule, CustomInputTextAreaSignal],
})
export class DatosServicioAddOrEdit implements OnInit {
  config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  data: any;
  proveedores: any;
  actividadControl = new FormControl<string>({ value: "", disabled: true });
  observacionesControl = new FormControl<string>({
    value: "",
    disabled: true,
  });

  ngOnInit(): void {
    this.data = this.config.data;
    this.proveedores = this.config.data.proveedores;
    this.actividadControl.setValue(this.data?.servicio || "");
    this.observacionesControl.setValue(this.data?.observaciones || "");
  }

  onDataProveedor(id: any) {
    this.dialogHandlerS.openDialog(
      TarjetaProveedor,
      { id },
      "Datos de proveedor",
      this.dialogHandlerS.sizeLg,
    );
  }
}









