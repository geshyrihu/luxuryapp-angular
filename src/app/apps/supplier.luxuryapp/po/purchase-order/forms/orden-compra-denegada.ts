import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
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
