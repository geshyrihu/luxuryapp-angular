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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

interface IToolForm {
  id: FormControl<string>;
  nameTool: FormControl<string>;
  brand: FormControl<string>;
  serie: FormControl<string>;
  model: FormControl<string>;
  photoPath: FormControl<string | File>;
  state: FormControl<number | null>;
  dateOfPurchase: FormControl<string>;
  technicalSpecifications: FormControl<string>;
  observations: FormControl<string>;
  categoryId: FormControl<string>;
  applicationUserId: FormControl<string>;
  customerId: FormControl<string | null>;
}
@Component({
  selector: "app-tool-form",
  templateUrl: "./tool-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    CustomInputImg,
    CardModule,
  ],
})
export class ToolForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  dateS = inject(DateService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  id: string = "";
  urlBaseImg = "";
  file: File;
  model: any;
  photoFileUpdate: boolean = false;

  cb_category: any[] = [{}];
  optionActive: ISelectItem[] = [];
  form: FormGroup<IToolForm>;

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();

    this.form = this.formB.group({
      id: new FormControl(this.id, { nonNullable: true }),
      nameTool: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
      }),
      brand: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      serie: new FormControl("", { nonNullable: true }),
      model: new FormControl("", { nonNullable: true }),
      photoPath: new FormControl<string | File>("", { nonNullable: true }),
      state: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      dateOfPurchase: new FormControl(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      technicalSpecifications: new FormControl("", { nonNullable: true }),
      observations: new FormControl("", { nonNullable: true }),
      categoryId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      customerId: new FormControl<string | null>(this.customerIdS.customerId()),
    });
  }

  onLoadSelectItem() {
    this.apiResponseS.onGetEnumSelectItem(`EState`).then((result: any) => {
      this.optionActive = result;
    });

    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`Categories`)
      .then((response: any) => {
        this.cb_category = response;
      });
  }
  onLoadData() {
    const urlApi = `Tools/Get/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.model = result;
      result.dateOfPurchase = this.dateS.getDateFormat(result.dateOfPurchase);
      this.urlBaseImg = this.model.photoPath;
      this.form.patchValue(result);
    });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "Tools",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (val) => this.onCreateFormData(val),
    });
  }
  onCreateFormData(DTO: any) {
    let formData = new FormData();

    formData.append("nameTool", DTO.nameTool);
    formData.append("brand", DTO.brand);
    formData.append("serie", DTO.serie);
    formData.append("model", DTO.model);
    formData.append("state", String(DTO.state));
    formData.append(
      "dateOfPurchase",
      this.dateS.getDateFormat(DTO.dateOfPurchase),
    );
    formData.append("technicalSpecifications", DTO.technicalSpecifications);
    formData.append("observations", DTO.observations);
    formData.append("categoryId", String(DTO.categoryId));
    formData.append("applicationUserId", String(this.authS.applicationUserId));
    formData.append("customerId", String(DTO.customerId));
    if (DTO.photoPath) {
      formData.append("photoPath", DTO.photoPath);
    }

    return formData;
  }
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
}
