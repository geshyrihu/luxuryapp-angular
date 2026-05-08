import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from "primeng/dynamicdialog";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { TarjetaProveedor } from "src/app/features/provider/provider-card";
@Component({
  selector: "app-datos-servicio-addoredit",
  templateUrl: "./datos-servicio-form.html",
  imports: [ReactiveFormsModule, CustomInputTextAreaSignal],
})
export class DatosServicioAddOrEdit implements OnInit {
  config = inject(DynamicDialogConfig);
  dialogS = inject(DialogService);
  data: any;
  proveedores: any;
  ref: DynamicDialogRef;
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
    this.ref = this.dialogS.open(TarjetaProveedor, {
      data: {
        id,
      },
      header: "Datos de proveedor",
      styleClass: "modal-lg",
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
}









