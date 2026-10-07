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
import { EnumSelectService } from "@core/services/enum-select.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-employee-emergency-contact-form",
  templateUrl: "./employee-emergency-contact-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LuxInputTextSignal,
    InputMask,
    LuxInputSelectSignal,
    ButtonWeb,
  ],
})
export class EmployeeEmergencyContactForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);
  cb_relacion = signal<SelectItemDto[]>([]);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    employeeId: new FormControl<string>(this.config.data.employeeId),
    nameContact: new FormControl<string>("", Validators.required),
    phoneNumber: new FormControl<string>("", Validators.required),
    relation: new FormControl<any>(null, Validators.required),
    contacOfBeneficiary: new FormControl<any>(
      this.config.data.contacOfBeneficiary,
    ),
  });

  async ngOnInit() {
    this.cb_relacion.set(
      await firstValueFrom(this.enumSelectS.relationEmployee()),
    );

    this.id = this.config.data.id || "";

    if (this.id !== "") this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EmployeeEmergencyContact.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.EmployeeEmergencyContact.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
