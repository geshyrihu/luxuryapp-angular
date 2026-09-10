import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { HttpErrorResponse } from "@angular/common/http";
import { MockAspelService, MockCuentaResponse, PolizaCreateRequest } from "./services/mock-aspel.service";

@Component({
  selector: "app-mock-aspel-poliza-form",
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LxCard, WebButtonLabel, AppIcon],
  templateUrl: "./mock-aspel-poliza-form.html",
  styleUrl: "./mock-aspel-poliza-form.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockAspelPolizaFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly mockAspelS = inject(MockAspelService);
  private readonly router = inject(Router);
  readonly saving = signal(false);
  readonly serverError = signal("");
  readonly success = signal("");
  readonly accountsLoading = signal(false);
  readonly accountsError = signal("");
  readonly accounts = signal<MockCuentaResponse[]>([]);
  readonly today = new Date().toISOString().slice(0, 10);

  readonly form = this.formBuilder.group({
    tipoPoli: ["Dr", Validators.required],
    numPoliz: ["", Validators.required],
    ejercicio: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
    periodo: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    fechaPol: [this.today, Validators.required],
    concepPo: ["", Validators.required],
    partidas: this.formBuilder.array([this.createPartida("D"), this.createPartida("H")]),
  });

  readonly partidas = this.form.controls.partidas;
  readonly totalDebe = computed(() => this.sumBy("D"));
  readonly totalHaber = computed(() => this.sumBy("H"));
  readonly isBalanced = computed(() => this.partidas.length > 1 && this.totalDebe() === this.totalHaber() && this.totalDebe() > 0);

  ngOnInit(): void {
    this.accountsLoading.set(true);
    this.mockAspelS.getCuentas().subscribe({
      next: (accounts) => { this.accounts.set(accounts); this.accountsLoading.set(false); },
      error: () => { this.accountsError.set("No se pudo cargar el catálogo de cuentas de detalle."); this.accountsLoading.set(false); },
    });
  }

  addPartida(): void { this.partidas.push(this.createPartida("D")); }
  removePartida(index: number): void { if (this.partidas.length > 2) this.partidas.removeAt(index); }

  onAccountChange(index: number): void {
    const partida = this.partidas.at(index);
    const account = this.accounts().find(candidate => candidate.numCta === partida.controls.numCta.value);
    this.setConditionalRequirement(partida.controls.uuidFiscal, account?.capturaUuid === 1, "");
    this.setConditionalRequirement(partida.controls.numDepto, account?.deptsino?.toUpperCase() === "S", 0);
  }

  requiresUuid(index: number): boolean { return this.partidas.at(index).controls.uuidFiscal.enabled; }
  requiresDepartment(index: number): boolean { return this.partidas.at(index).controls.numDepto.enabled; }

  save(): void {
    this.serverError.set(""); this.success.set("");
    if (this.form.invalid || !this.isBalanced()) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.mockAspelS.createPoliza(this.form.getRawValue() as PolizaCreateRequest).subscribe({
      next: () => { this.saving.set(false); this.success.set("Póliza guardada y saldos actualizados."); setTimeout(() => this.router.navigate(["/contabilidad/mock-aspel"]), 700); },
      error: (error: HttpErrorResponse) => { this.saving.set(false); this.serverError.set(this.mapError(error)); },
    });
  }

  private createPartida(debeHaber: "D" | "H") {
    return this.formBuilder.group({
      numPart: [0], numCta: ["", Validators.required], debeHaber: [debeHaber, Validators.required], montoMov: [0, [Validators.required, Validators.min(0.01)]], tipCambio: [1],
      uuidFiscal: [{ value: "", disabled: true }], numDepto: [{ value: 0, disabled: true }],
    });
  }

  private setConditionalRequirement(control: any, required: boolean, resetValue: string | number): void {
    if (required) {
      control.enable({ emitEvent: false });
      control.setValidators([Validators.required]);
    } else {
      control.reset(resetValue, { emitEvent: false });
      control.clearValidators();
      control.disable({ emitEvent: false });
    }
    control.updateValueAndValidity({ emitEvent: false });
  }

  private sumBy(debeHaber: "D" | "H"): number {
    return this.partidas.controls.filter(control => control.controls.debeHaber.value === debeHaber).reduce((sum, control) => sum + Number(control.controls.montoMov.value || 0), 0);
  }

  private mapError(error: HttpErrorResponse): string {
    const message = error.error?.message || error.error?.detail || error.error;
    if (message) return message;
    return ({ 400: "Revisa las cuentas de detalle y los datos de la póliza.", 403: "El periodo contable ya está cerrado.", 409: "Ya existe una póliza con esos datos.", 422: "La póliza no cuadra." } as Record<number, string>)[error.status] || "No se pudo guardar la póliza.";
  }
}
