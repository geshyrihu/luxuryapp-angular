import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";

@Component({
  selector: "app-inspeccion-agregar-revision",
  imports: [CustomInputSelectSignal, CustomButtonSave],
  templateUrl: "./inspeccion-agregar-revision.html",
})
export class InspeccionAgregarRevision {
  revisionControl = new FormControl<string | null>(null);

  readonly revisionOptions = [
    { label: "Iluminacion", value: "Iluminacion" },
    { label: "Píntura", value: "Píntura" },
    { label: "Funcionamiento de chapas", value: "Funcionamiento de chapas" },
    { label: "Estado de carpinteria", value: "Estado de carpinteria" },
    { label: "Funcionamiento w.c.", value: "Funcionamiento w.c." },
  ];
}
