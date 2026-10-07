import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

@Component({
  selector: "app-cuadro-comparativo-add-budget",
  template: `
    <div class="pt-2 pb-2">
      <lux-input-select-signal
        [control]="budgetAccountControl"
        [data]="budgetSelectOptions"
        label="Cuenta presupuestal"
        placeholder="Busca y selecciona una cuenta"
        [filter]="true"
        filterBy="label"
        [showClear]="true"
      />
    </div>

    <div
      class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border"
    >
      <lux-button-web
        displayMode="icon"
        label="Cancelar"
        severity="secondary"
        variant="outline"
        size="small"
        (clicked)="onCancel()"
      />
      <lux-button-web
        displayMode="icon"
        label="Continuar"
        iconClass="material-symbols-light:arrow-forward"
        severity="contrast"
        size="small"
        (clicked)="onConfirm()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb, CommonModule, ReactiveFormsModule, LuxInputSelectSignal],
})
export class CuadroComparativoAddBudget {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  budgetAccountControl = new FormControl<string | null>(null);
  budgetSelectOptions: SelectItemDto[] = [];

  constructor() {
    if (this.config.data?.budgetOptions) {
      this.budgetSelectOptions = this.config.data.budgetOptions;
    }
  }

  onConfirm() {
    const selectedAccountNumber = this.budgetAccountControl.value;
    if (!selectedAccountNumber) {
      return;
    }
    this.ref.close(selectedAccountNumber);
  }

  onCancel() {
    this.ref.close();
  }
}
