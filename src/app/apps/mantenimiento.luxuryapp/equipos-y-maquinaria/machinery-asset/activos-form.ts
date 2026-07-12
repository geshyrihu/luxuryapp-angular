import { Endpoints } from "src/app/core/constants/endpoints";
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
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IActivosFormGroup {
  id: FormControl<string>;
  brand: FormControl<string>;
  customerId: FormControl<string | null>;
  dateOfPurchase: FormControl<string>;
  equipoClasificacionId: FormControl<string | null>;
  inventoryCategory: FormControl<number | null>;
  model: FormControl<string>;
  nameMachinery: FormControl<string>;
  observations: FormControl<string>;
  photoPath: FormControl<string | File>;
  serie: FormControl<string>;
  state: FormControl<number | null>;
  technicalSpecifications: FormControl<string>;
  ubication: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-activos-form",
  templateUrl: "./activos-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    InputImg,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class ActivosForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  getdateService = inject(DateService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);
  submitting = signal(false);
  id: string = "";
  applicationUserId = this.authS.userToken.infoUserAuthDTO.applicationUserId;
  machineryDTO: any;
  photoFileUpdate: boolean = false;
  category: any;
  cb_equipoClasificacion: SelectItemDto[] = [];

  form: FormGroup<IActivosFormGroup>;

  cb_inventoryCategory: SelectItemDto[] = [];
  optionActive: SelectItemDto[] = [];
  ngOnInit() {
    this.onLoadEquipoClasificacion();
    this.onLoadEnum();

    // Inicialización síncrona para evitar NG0100
    this.category = this.config.data.paramId;
    this.id = this.config.data.id !== 0 ? this.config.data.id : "";

    this.form = this.formB.group({
      id: new FormControl(this.id, { nonNullable: true }),
      brand: new FormControl("", { nonNullable: true }),
      customerId: new FormControl<string | null>(this.customerIdS.customerId()),
      dateOfPurchase: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      equipoClasificacionId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      inventoryCategory: new FormControl<number | null>(this.category, {
        validators: [Validators.required],
      }),
      model: new FormControl("", { nonNullable: true }),
      nameMachinery: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
      }),
      observations: new FormControl("", { nonNullable: true }),
      photoPath: new FormControl<string | File>("", { nonNullable: true }),
      serie: new FormControl("", { nonNullable: true }),
      state: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      technicalSpecifications: new FormControl("", { nonNullable: true }),
      ubication: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      applicationUserId: new FormControl<string | null>(
        this.authS.applicationUserId,
      ),
    });

    if (this.id) {
      setTimeout(() => {
        this.onLoadData(this.id);
      }, 0);
    }
  }
  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  onLoadData(id: string) {
    const urlApi = Endpoints.RefactorMantenimiento.machineriesById(id);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.id = result.id;
      result.dateOfPurchase = this.getdateService.getDateFormat(
        result.dateOfPurchase,
      );
      this.form.patchValue(result);

      const contenidoHTML = this.form.get("technicalSpecifications").value;
      if (contenidoHTML) {
        const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, "");
        this.form.get("technicalSpecifications").patchValue(contenidoSinHTML);
      }

      const contenidoHTML2 = this.form.get("observations").value;
      if (contenidoHTML2) {
        const contenidoSinHTML2 = contenidoHTML2.replace(/<[^>]*>|&nbsp;/g, "");
        this.form.get("observations").patchValue(contenidoSinHTML2);
      }
    });
  }

  async onLoadEnum() {
    const categories = await firstValueFrom(
      this.enumSelectS.inventoryCategory(),
    );
    const states = await firstValueFrom(this.enumSelectS.state());

    setTimeout(() => {
      this.cb_inventoryCategory = categories;
      this.optionActive = states;
    }, 0);
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "machineries",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (val) => this.createFormData(val),
    });
  }

  private createFormData(machineryDTO: any): FormData {
    let formData = new FormData();
    formData.append("applicationUserId", machineryDTO.applicationUserId);
    formData.append("nameMachinery", machineryDTO.nameMachinery);
    formData.append("ubication", machineryDTO.ubication);
    formData.append("brand", machineryDTO.brand);
    formData.append("serie", machineryDTO.serie);
    formData.append("model", machineryDTO.model);
    formData.append("state", String(machineryDTO.state));
    formData.append(
      "dateOfPurchase",
      this.dateS.getDateFormat(machineryDTO.dateOfPurchase),
    );
    formData.append("customerId", String(this.customerIdS.customerId()));
    formData.append(
      "equipoClasificacionId",
      String(machineryDTO.equipoClasificacionId),
    );
    formData.append(
      "inventoryCategory",
      String(machineryDTO.inventoryCategory),
    );
    formData.append(
      "technicalSpecifications",
      machineryDTO.technicalSpecifications,
    );
    formData.append("observations", machineryDTO.observations);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (machineryDTO.photoPath) {
      formData.append("photoPath", machineryDTO.photoPath);
    }
    return formData;
  }

  onLoadEquipoClasificacion() {
    const urlApi = `equipoclasificacion`;
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(urlApi)
      .then((result: any) => {
        setTimeout(() => {
          this.cb_equipoClasificacion = result;
        }, 0);
      });
  }
}
