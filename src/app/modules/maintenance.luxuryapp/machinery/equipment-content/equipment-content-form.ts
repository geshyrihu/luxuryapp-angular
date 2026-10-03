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
import { EndpointsMantenimiento } from "@core/constants/endpoints/mantenimiento.endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { firstValueFrom } from "rxjs";
import {
  EquipmentContentFormDialogData,
  EquipmentContentFormGroup,
} from "./interfaces/equipment-content.interface";
import { EquipmentContentDto } from "./interfaces/equipment-content.dto";

@Component({
  selector: "app-equipment-content-form",
  templateUrl: "./equipment-content-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputTextAreaSignal,
    InputImg,
    WebButtonLabelSave,
  ],
})
export class EquipmentContentForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly enumSelectS = inject(EnumSelectService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogRef = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly contentTypes = signal<SelectItemDto[]>([]);
  readonly currentPhoto = signal("");

  private id: string | null = null;
  private equipmentId = "";
  form!: FormGroup<EquipmentContentFormGroup>;

  async ngOnInit(): Promise<void> {
    const data = this.config.data as EquipmentContentFormDialogData;
    this.id = data.id;
    this.equipmentId = data.equipmentId;
    this.form = this.formBuilder.group<EquipmentContentFormGroup>({
      name: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      type: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      quantity: new FormControl<number | null>(1, {
        validators: [Validators.required, Validators.min(1)],
      }),
      notes: new FormControl("", { nonNullable: true }),
      photo: new FormControl<string | File>("", { nonNullable: true }),
      removePhoto: new FormControl(false, { nonNullable: true }),
    });

    this.contentTypes.set(
      await firstValueFrom(this.enumSelectS.equipmentContentType()),
    );

    if (this.id) await this.onLoadData();
  }

  onPhotoSelected(file: File): void {
    this.form.controls.photo.setValue(file);
    this.form.controls.removePhoto.setValue(false);
  }

  removeCurrentPhoto(): void {
    this.currentPhoto.set("");
    this.form.controls.photo.setValue("");
    this.form.controls.removePhoto.setValue(true);
  }

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: EndpointsMantenimiento.EquipmentContents.create,
      id: this.id,
      ref: this.dialogRef,
      submitting: this.submitting,
      transformPayload: (value) => this.toFormData(value),
    });
  }

  private async onLoadData(): Promise<void> {
    const result = await this.apiResponseS.onGetItem<EquipmentContentDto>(
      EndpointsMantenimiento.EquipmentContents.byId(this.id!),
    );
    if (!result) return;

    this.form.patchValue({
      name: result.name,
      type: result.type,
      quantity: result.quantity,
      notes: result.notes ?? "",
    });
    this.currentPhoto.set(result.photoUrl ?? "");
  }

  private toFormData(value: {
    name: string;
    type: number | null;
    quantity: number | null;
    notes: string;
    photo: string | File;
    removePhoto: boolean;
  }): FormData {
    const formData = new FormData();
    if (!this.id) formData.append("equipmentId", this.equipmentId);
    formData.append("name", value.name);
    formData.append("type", String(value.type ?? ""));
    formData.append("quantity", String(value.quantity ?? ""));
    formData.append("notes", value.notes);
    formData.append("removePhoto", String(value.removePhoto));
    if (value.photo instanceof File) formData.append("photo", value.photo);
    return formData;
  }
}
