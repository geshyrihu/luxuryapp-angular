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
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

@Component({
  selector: "app-catalogo-descripcion-form",
  templateUrl: "./catalogo-descripcion-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    CardModule,
  ],
})
export class CatalogoDescripcionForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  cb_area_responsable = signal<ISelectItem[]>([
    { value: "CONTABLE", label: "CONTABLE" },
    { value: "OPERACIONES", label: " OPERACIONES" },
    { value: "JURIDICO", label: "JURIDICO" },
    { value: "MANTENIMIENTO", label: "MANTENIMIENTO" },
  ]);

  cb_grupo = signal<ISelectItem[]>([]);
  cb_state = signal<ISelectItem[]>([
    { value: 1, label: "Activo" },
    { value: 0, label: "Inactivo" },
  ]);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    folioId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    departamento: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    state: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    descripcion: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    grupo: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
  });

  ngOnInit(): void {
    this.onLoadGrupos();
    this.id = this.config.data.id;
    if (this.id) {
      this.form.patchValue({ id: this.id });
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EntregaRecepcion.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onLoadGrupos() {
    this.apiResponseS
      .onGetList(Endpoints.EntregaRecepcion.grupos)
      .then((result: any) => {
        this.cb_grupo.set(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.EntregaRecepcion.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
