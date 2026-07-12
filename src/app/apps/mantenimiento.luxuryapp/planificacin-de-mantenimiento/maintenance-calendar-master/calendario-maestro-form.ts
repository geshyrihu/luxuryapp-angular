import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface ICalendarioMaestroForm {
  id: FormControl<string>;
  calendarioMaestroEquipoId: FormControl<number | null>;
  descripcionServicio: FormControl<string>;
  mes: FormControl<number | null>;
  observaciones: FormControl<string>;
  proveedores: FormControl<string[]>;
}

@Component({
  selector: "app-calendario-maestro-form",
  templateUrl: "./calendario-maestro-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CustomInputMultiselectSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class CalendarioMaestroForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  customerIdS = inject(CustomerIdService);

  // Signals para selectores
  cb_equipoCalendarioMaestro = signal<SelectItemDto[]>([]);
  cb_providers = signal<SelectItemDto[]>([]);
  cb_meses = signal<SelectItemDto[]>([]);

  id: string = "";
  submitting = signal(false);

  // Definición estricta del formulario
  form: FormGroup<ICalendarioMaestroForm> =
    new FormGroup<ICalendarioMaestroForm>({
      id: new FormControl<string>("", { nonNullable: true }),
      calendarioMaestroEquipoId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      descripcionServicio: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      mes: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      observaciones: new FormControl<string>("", { nonNullable: true }),
      proveedores: new FormControl<string[]>([], { nonNullable: true }),
    });

  async ngOnInit() {
    this.id = this.config.data.id || 0;

    // Cargar catálogos
    const meses = await firstValueFrom(this.enumSelectS.month(false));
    this.cb_meses.set(meses);
    this.onLoadSelectItem();

    // Inicializar form
    this.form.patchValue({
      id: this.id,
      mes: this.config.data.mes,
    });

    if (this.id) this.onLoadData(this.id);
  }

  onLoadData(id: string) {
    this.apiResponseS
      .onGetItem(Endpoints.RefactorMantenimiento.calendarioMaestroById(id))
      .then((result: any) => {
        this.form.patchValue(result);
        // Asegurar que el mes no se sobrescriba incorrectamente si viene null del back
        if (this.config.data.mes) {
          this.form.patchValue({ mes: this.config.data.mes });
        }
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "calendario-maestro",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>("equipo-calendario-maestro")
      .then((response: SelectItemDto[]) => {
        this.cb_equipoCalendarioMaestro.set(response);
      });

    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        `providers/${this.customerIdS.customerId()}`,
      )
      .then((response: SelectItemDto[]) => {
        this.cb_providers.set(response);
      });
  }
}
