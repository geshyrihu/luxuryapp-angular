import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
export interface IOrdenCompraDenegadaForm {
  id: FormControl<string | null>;
  ordenCompraId: FormControl<string | null>;
  fechaAutorizacion: FormControl<string | null>;
  statusOrdenCompra: FormControl<number | null>;
  observaciones: FormControl<string | null>;
}

@Component({
  selector: "app-orden-compra-denegada",
  templateUrl: "./orden-compra-denegada.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class OrdenCompraDenegada implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  ordenCompraId: string = "";
  ordenCompraAuthId: string = "";
  form: FormGroup<IOrdenCompraDenegadaForm>;

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.ordenCompraAuthId = this.config.data.ordenCompraAuthId;
    this.form = this.formB.group<IOrdenCompraDenegadaForm>({
      id: new FormControl(this.ordenCompraAuthId),
      ordenCompraId: new FormControl(this.ordenCompraId),
      fechaAutorizacion: new FormControl(""),
      statusOrdenCompra: new FormControl(1),
      observaciones: new FormControl("", Validators.required),
    });
  }

  onSubmit() {
    this.submitting.set(true);
    this.apiResponseS
      .onPut(
        `OrdenCompraAuth/NoAutorizada/${this.ordenCompraAuthId}/${this.authS.applicationUserId}`,
        this.form.value,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}










