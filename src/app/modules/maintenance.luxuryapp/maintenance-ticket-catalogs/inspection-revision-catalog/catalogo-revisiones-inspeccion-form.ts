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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { CatalogoRevisionesInspeccionFormGroup } from "./interfaces/catalogo-revisiones-inspeccion-form.interface";

@Component({
  selector: "app-catalogo-revisiones-inspeccion-form",
  imports: [
    ReactiveFormsModule,
    LuxInputTextSignal,
    LuxInputSelectSignal,
    ButtonWeb,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalogo-revisiones-inspeccion-form.html",
})
export class CatalogoRevisionesInspeccionForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  cb_departament = signal<SelectItemDto[]>([]);
  cb_equipoClasificacion = signal<SelectItemDto[]>([]);

  form: FormGroup<CatalogoRevisionesInspeccionFormGroup> = new FormGroup({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    description: new FormControl<string>("", {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
    departament: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    equipoClasificacionId: new FormControl<string>("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
    this.form.controls.id.setValue(this.id);
    this.onLoadDepartament();
    this.onLoadEquipoClasificacion();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.InspectionReviewCatalog.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
  onLoadDepartament() {
    this.apiResponseS
      .onGetEnumSelectItem(Endpoints.EnumSelectItems.departament)
      .then((result: any) => {
        this.cb_departament.set(result);
      });
  }
  onLoadEquipoClasificacion() {
    this.apiResponseS
      .onGetSelectItem(Endpoints.SelectItems.equipmentClassifications)
      .then((result: any) => {
        this.cb_equipoClasificacion.set(result);
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.InspectionReviewCatalog.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
