import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";

@Component({
  selector: "app-inspeccion-agregar-revision",
  imports: [CustomInputSelectSignal, WebButtonLabelSave],
  templateUrl: "./inspeccion-agregar-revision.html",
})
export class InspeccionAgregarRevision {
  revisionControl = new FormControl<string | null>(null);

  readonly revisionOptions = [
    { label: "Iluminacion", value: "Iluminacion" },
    { label: "Póntura", value: "Póntura" },
    { label: "Funcionamiento de chapas", value: "Funcionamiento de chapas" },
    { label: "Estado de carpinteria", value: "Estado de carpinteria" },
    { label: "Funcionamiento w.c.", value: "Funcionamiento w.c." },
  ];
}
