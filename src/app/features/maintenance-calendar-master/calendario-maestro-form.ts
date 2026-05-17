import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface ICalendarioMaestroForm {
  id: FormControl<string>;
  calendarioMaestroEquipoId: FormControl<number | null>;
  descripcionServicio: FormControl<string>;
  mes: FormControl<number | null>;
  observaciones: FormControl<string>;
  proveedores: FormControl<number[]>;
}

@Component({
  selector: "app-calendario-maestro-form",
  templateUrl: "./calendario-maestro-form.html",
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    SelectModule,
    MultiSelectModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class CalendarioMaestroForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  customerIdS = inject(CustomerIdService);

  // Signals para selectores
  cb_equipoCalendarioMaestro = signal<ISelectItem[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  cb_meses = signal<ISelectItem[]>([]);

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
      proveedores: new FormControl<number[]>([], { nonNullable: true }),
    });

  async ngOnInit() {
    this.id = this.config.data.id || 0;

    // Cargar católogos
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
      .onGetItem(`CalendarioMaestro/${id}`)
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
      endpoint: "CalendarioMaestro",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("EquipoCalendarioMaestro")
      .then((response: ISelectItem[]) => {
        this.cb_equipoCalendarioMaestro.set(response);
      });

    this.apiResponseS
      .onGetSelectItem<
        ISelectItem[]
      >(`providers/${this.customerIdS.customerId()}`)
      .then((response: ISelectItem[]) => {
        this.cb_providers.set(response);
      });
  }
}
