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
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IPiscinaForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  ubication: FormControl<string>;
  volumen: FormControl<number | null>;
  pathImage: FormControl<File | string | null>;
  typePiscina: FormControl<number | null>;
  applicationUserId: FormControl<string>;
  customerId: FormControl<string>;
}

@Component({
  selector: "app-piscina-form",
  templateUrl: "./piscina-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    InputImg,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
  ],
})
export class PiscinaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  id = signal<string | null>(null);
  model = signal<any>(null);
  cb_typePiscina = signal<SelectItemDto[]>([]);

  form: FormGroup<IPiscinaForm> = new FormGroup<IPiscinaForm>({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    ubication: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    volumen: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(1000000),
      ],
    }),
    pathImage: new FormControl<File | string | null>(null),
    typePiscina: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
    }),
    customerId: new FormControl(this.customerIdS.customerId(), {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.onLoadEnumSelectItem().then(() => {
      const configId = this.config.data.id;
      if (configId) {
        this.id.set(configId);
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const urlApi = Endpoints.RefactorMantenimiento.piscinaById(this.id());
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.model.set(result);
      const tipo = this.cb_typePiscina().find((x: any) => x.label === result.typePiscina);
      this.form.patchValue({ ...result, typePiscina: tipo ? Number(tipo.value) : null });
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formDataDTO = this.onCreateFormData(this.form.getRawValue());
    this.submitting.set(true);

    if (!this.id()) {
      this.apiResponseS
        .onPost(Endpoints.RefactorMantenimiento.piscina, formDataDTO)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          Endpoints.RefactorMantenimiento.piscinaById(this.id()),
          formDataDTO,
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  onCreateFormData(DTO: any) {
    let formData = new FormData();
    formData.append("name", DTO.name);
    formData.append("ubication", DTO.ubication);
    formData.append("volumen", DTO.volumen);
    formData.append("typePiscina", String(DTO.typePiscina));
    // formData.append("customerId", String(this.customerIdS.customerId())); // Already in DTO
    formData.append("applicationUserId", String(this.authS.applicationUserId));
    formData.append("customerId", String(DTO.customerId));
    if (DTO.pathImage instanceof File) {
      formData.append("pathImage", DTO.pathImage);
    }
    return formData;
  }

  uploadFile(file: File) {
    this.form.patchValue({ pathImage: file });
  }

  onLoadEnumSelectItem(): Promise<void> {
    return this.apiResponseS
      .onGetEnumSelectItem(Endpoints.EnumSelectItems.typePiscina)
      .then((result: any) => {
        this.cb_typePiscina.set(result);
      });
  }
}
