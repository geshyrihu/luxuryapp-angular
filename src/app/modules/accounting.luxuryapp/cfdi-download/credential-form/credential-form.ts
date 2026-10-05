import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { EndpointsContabilidad } from "@core/constants/endpoints/contabilidad.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { CustomerSatCredentialDto } from "../interfaces/cfdi-download.interfaces";

/**
 * Carga o reemplaza la e.firma (FIEL) de un customer. Solo visible/accesible
 * para SuperUsuario/Direccion (RN-CFD-020, D15/D17) — el role-gate real vive
 * en el hub que abre este modal y en el backend; aquí no se repite el check.
 */
@Component({
  selector: "app-credential-form",
  templateUrl: "./credential-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CredentialForm {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  cerFile = signal<File | null>(null);
  keyFile = signal<File | null>(null);

  form = new FormGroup({
    password: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
  });

  onCerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cerFile.set(input.files?.[0] ?? null);
  }

  onKeySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.keyFile.set(input.files?.[0] ?? null);
  }

  get canSubmit(): boolean {
    return !!this.cerFile() && !!this.keyFile() && this.form.valid && !this.submitting();
  }

  async onSubmit(): Promise<void> {
    if (!this.canSubmit) return;

    this.submitting.set(true);
    const formData = new FormData();
    formData.append("CerFile", this.cerFile()!, this.cerFile()!.name);
    formData.append("KeyFile", this.keyFile()!, this.keyFile()!.name);
    formData.append("Password", this.form.controls.password.value);

    const urlApi = EndpointsContabilidad.CfdiDownload.uploadCredential(
      this.customerIdS.customerId(),
    );

    const result = await this.apiResponseS.onPostFile<CustomerSatCredentialDto>(
      urlApi,
      formData,
    );
    this.submitting.set(false);

    if (result) {
      this.ref.close(result);
    }
  }

  onCancel(): void {
    this.ref.close();
  }
}
