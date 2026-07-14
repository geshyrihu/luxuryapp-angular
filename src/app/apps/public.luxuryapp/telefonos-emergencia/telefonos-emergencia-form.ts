import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

interface ITelefonosEmergenciaForm {
  id: FormControl<string | null>;
  instancia: FormControl<string>;
  telefonoUno: FormControl<string>;
  telefonoDos: FormControl<string | null>;
  direccion: FormControl<string | null>;
  logo: FormControl<string | File | null>;
}

@Component({
  selector: "app-telefonos-emergencia-form",
  templateUrl: "./telefonos-emergencia-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputImg,
    InputMask,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class TelefonosEmergenciaForm {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  urlBaseImg = "";
  model: any;
  photoFileUpdate: boolean = false;
  form: FormGroup<ITelefonosEmergenciaForm>;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();

    this.form = this.formB.group({
      id: new FormControl({ value: this.id, disabled: true }),
      instancia: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      telefonoUno: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      telefonoDos: new FormControl(""),
      direccion: new FormControl(""),
      logo: new FormControl<string | File>(""),
    });
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ logo: file });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EmergencyPhones.getById(this.id))
      .then((result: any) => {
        this.urlBaseImg = result.logo;
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.EmergencyPhones.create, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.EmergencyPhones.update(this.id), formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    formData.append("instancia", DTO.instancia);
    formData.append("telefonoUno", DTO.telefonoUno);
    formData.append("telefonoDos", DTO.telefonoDos);
    formData.append("direccion", DTO.direccion);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (DTO.logo) {
      formData.append("logo", DTO.logo);
    }
    return formData;
  }
}
