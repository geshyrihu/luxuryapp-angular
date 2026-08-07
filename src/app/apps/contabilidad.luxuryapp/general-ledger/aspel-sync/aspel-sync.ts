import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { AspelSyncService } from "./aspel-sync.service";

interface IAspelSyncForm {
  year: FormControl<number>;
}

@Component({
  selector: "app-aspel-sync",
  templateUrl: "./aspel-sync.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppIcon,
    WebButtonLabel,
    CustomInputNumberSignal,
    LxCard,
  ],
})
export class AspelSyncComponent {
  private formB = inject(FormBuilder);
  private aspelSyncS = inject(AspelSyncService);
  private customerIdS = inject(CustomerIdService);
  private customToastS = inject(CustomToastService);

  syncing = signal(false);
  lastResult = signal<any>(null);
  lastAction = signal<string>("");

  currentCustomerId = this.customerIdS.customerId;
  currentCustomerName = this.customerIdS.customerName;
  customerDataReady = this.customerIdS.customerDataReady;

  currentYear = new Date().getFullYear();

  form = this.formB.group<IAspelSyncForm>({
    year: new FormControl(this.currentYear, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(2000),
        Validators.max(2100),
      ],
    }),
  });

  syncCompleto() {
    this.runSync("completa", () =>
      this.aspelSyncS.syncCompleto(
        this.currentCustomerId(),
        this.form.controls.year.value,
      ),
    );
  }

  syncContabilidad() {
    this.runSync("contabilidad", () =>
      this.aspelSyncS.syncContabilidad(
        this.currentCustomerId(),
        this.form.controls.year.value,
      ),
    );
  }

  syncCobranza() {
    this.runSync("cobranza", () =>
      this.aspelSyncS.syncCobranza(
        this.currentCustomerId(),
        this.form.controls.year.value,
      ),
    );
  }

  private runSync(action: string, runner: () => Promise<any>) {
    if (!this.customerDataReady()) {
      this.customToastS.showInfo(
        "Cliente no cargado",
        "Espera a que termine de cargarse el cliente activo.",
      );
      return;
    }

    if (!this.currentCustomerId()) {
      this.customToastS.showError(
        "Cliente no disponible",
        "No se encontré un cliente activo para sincronizar.",
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.customToastS.showError(
        "Aóo invólido",
        "Revisa el aóo antes de ejecutar la sincronización.",
      );
      return;
    }

    this.syncing.set(true);
    this.lastResult.set(null);
    this.lastAction.set(action);
    this.customToastS.showInfo(
      "Sincronización iniciada",
      "Este proceso puede tardar varios minutos.",
    );

    runner()
      .then((result) => {
        this.lastResult.set(result);
        this.customToastS.showSuccess(
          "Sincronización completada",
          `La sincronización ${action} terminé correctamente.`,
        );
      })
      .catch((error) => {
        this.lastResult.set(error?.error ?? error);
        this.customToastS.showError(
          "Sincronización fallida",
          `No se pudo completar la sincronización ${action}.`,
        );
      })
      .finally(() => {
        this.syncing.set(false);
      });
  }

  canExecute(): boolean {
    return !this.syncing() && this.form.valid && this.customerDataReady();
  }
}
