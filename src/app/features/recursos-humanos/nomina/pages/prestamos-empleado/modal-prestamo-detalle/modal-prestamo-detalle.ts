import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  PagoPrestamoDTO,
  PrestamoEmpleadoDecisionDTO,
  PrestamoEmpleadoDTO,
} from "../../../interfaces/prestamo-empleado.interface";

@Component({
  selector: "app-modal-prestamo-detalle",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonSave,
    CustomInputTextAreaSignal,
  ],
  templateUrl: "./modal-prestamo-detalle.html",
})
export default class ModalPrestamoDetalle implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  prestamo = signal<PrestamoEmpleadoDTO | null>(null);
  pagos = signal<PagoPrestamoDTO[]>([]);
  loading = signal(false);
  procesando = signal(false);

  formDecision = this.fb.nonNullable.group({
    observaciones: ["", [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    const item: PrestamoEmpleadoDTO = this.config.data?.item;
    this.prestamo.set(item);
    this.loadPagos(item.id);
  }

  async loadPagos(prestamoId: string): Promise<void> {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetList<PagoPrestamoDTO[]>(
      `hr/nomina/prestamos/${prestamoId}/historial-pagos`,
    );
    this.pagos.set((result as any) ?? []);
    this.loading.set(false);
  }

  async autorizar(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.formDecision)) return;
    const prestamoId = this.prestamo()?.id ?? "";
    const dto: PrestamoEmpleadoDecisionDTO = this.formDecision.getRawValue();
    this.procesando.set(true);
    const result = await this.apiResponseS.onPut(
      `hr/nomina/prestamos/${prestamoId}/autorizar`,
      dto,
    );
    this.procesando.set(false);
    if (result) this.ref.close(true);
  }

  async cancelar(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.formDecision)) return;
    const prestamoId = this.prestamo()?.id ?? "";
    const dto: PrestamoEmpleadoDecisionDTO = this.formDecision.getRawValue();
    this.procesando.set(true);
    const result = await this.apiResponseS.onPut(
      `hr/nomina/prestamos/${prestamoId}/cancelar`,
      dto,
    );
    this.procesando.set(false);
    if (result) this.ref.close(true);
  }

  get progreso(): number {
    const p = this.prestamo();
    if (!p || p.numeroPagos === 0) return 0;
    return Math.round((p.pagosRealizados / p.numeroPagos) * 100);
  }

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: "warn",
      Autorizado: "success",
      Cancelado: "danger",
      Liquidado: "secondary",
    };
    return map[estado] ?? "secondary";
  }
}
