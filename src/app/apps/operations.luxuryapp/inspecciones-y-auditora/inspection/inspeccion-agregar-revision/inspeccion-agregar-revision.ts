import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

@Component({
  selector: "app-inspeccion-agregar-revision",
  imports: [CustomInputSelectSignal, WebButtonLabelSave],
  changeDetection: ChangeDetectionStrategy.Eager,
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
